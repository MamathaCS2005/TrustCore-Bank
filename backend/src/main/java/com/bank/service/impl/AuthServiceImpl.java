package com.bank.service.impl;

import com.bank.config.JwtTokenProvider;
import com.bank.dto.AuthDTOs.*;
import com.bank.entity.*;
import com.bank.repository.*;
import com.bank.service.AuthService;
import com.bank.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final OTPVerificationRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    @Value("${app.otp.demo-mode:false}")
    private boolean otpDemoMode;

    public AuthServiceImpl(UserRepository userRepository, RoleRepository roleRepository,
                            CustomerRepository customerRepository, AccountRepository accountRepository,
                            OTPVerificationRepository otpRepository, PasswordEncoder passwordEncoder,
                            AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider,
                            EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.customerRepository = customerRepository;
        this.accountRepository = accountRepository;
        this.otpRepository = otpRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailService = emailService;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Retrieve User to check status before authenticating
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if ("FROZEN".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("Your account is frozen. Please contact admin.");
        } else if ("CLOSED".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("Your account has been closed.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication, request.isRememberMe());

        String role = user.getRole().getName();
        String fullName = "";
        Long customerId = null;

        if ("ROLE_CUSTOMER".equals(role)) {
            Optional<Customer> customerOpt = customerRepository.findByUser(user);
            if (customerOpt.isPresent()) {
                fullName = customerOpt.get().getFullName();
                customerId = customerOpt.get().getId();
            }
        }

        return new AuthResponse(token, user.getUsername(), user.getEmail(), role, fullName, customerId, user.getStatus());
    }

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Default customer role not found"));

        // Create User
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setMobileNumber(request.getMobileNumber());
        user.setStatus("ACTIVE");
        user.setRole(role);
        user = userRepository.save(user);

        // Create Customer details
        Customer customer = new Customer();
        customer.setUser(user);
        customer.setFullName(request.getFullName());
        customer.setAddress(request.getAddress());
        customer.setDateOfBirth(request.getDateOfBirth());
        customer.setPanNumber(request.getPanNumber());
        customer.setAadharNumber(request.getAadharNumber());
        customer.setKycStatus("PENDING");
        customer = customerRepository.save(customer);

        // Create Default Bank Account for the Customer
        String accountNumber = generateUniqueAccountNumber();
        Account account = new Account();
        account.setAccountNumber(accountNumber);
        account.setCustomer(customer);
        account.setBalance(new BigDecimal("1000.00")); // Give default $1000 sign-up bonus
        account.setAccountType("SAVINGS");
        account.setStatus("ACTIVE");
        accountRepository.save(account);
    }

    private String generateUniqueAccountNumber() {
        Random random = new Random();
        String accNum;
        do {
            long number = 1000000000L + (long)(random.nextDouble() * 9000000000L);
            accNum = String.valueOf(number);
        } while (accountRepository.existsByAccountNumber(accNum));
        return accNum;
    }

    @Override
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private static final int OTP_MAX_ATTEMPTS = 5;
    private static final int OTP_RESEND_COOLDOWN_SECONDS = 60;
    private static final int OTP_VALIDITY_MINUTES = 5;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    // Generates a cryptographically secure random 6-digit OTP ("000000"-"999999").
    private String generateSecureOtp() {
        int value = SECURE_RANDOM.nextInt(1_000_000);
        return String.format("%06d", value);
    }

    @Override
    @Transactional
    public String initiateForgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail();
        userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account registered with this email address"));

        // Check if an OTP was recently generated (within the resend cooldown window)
        Optional<OTPVerification> lastOtpOpt = otpRepository.findFirstByEmailOrderByCreatedAtDesc(email);
        if (lastOtpOpt.isPresent()) {
            OTPVerification lastOtp = lastOtpOpt.get();
            long secondsSinceLast = Duration.between(lastOtp.getCreatedAt(), LocalDateTime.now()).getSeconds();
            if (secondsSinceLast < OTP_RESEND_COOLDOWN_SECONDS) {
                throw new RuntimeException("Please wait " + (OTP_RESEND_COOLDOWN_SECONDS - secondsSinceLast) + " seconds before requesting a new OTP.");
            }
            // Invalidate the previous OTP so it can never be used again, even if
            // still within its original 5-minute expiry window.
            if (!lastOtp.getVerified() && lastOtp.getExpiryTime().isAfter(LocalDateTime.now())) {
                lastOtp.setExpiryTime(LocalDateTime.now().minusSeconds(1));
                otpRepository.save(lastOtp);
            }
        }

        // Generate a cryptographically secure random 6-digit OTP.
        String otp = generateSecureOtp();

        // Store only a BCrypt hash of the OTP - never the plaintext - the same
        // way user passwords are protected. The plaintext is only ever held in
        // memory long enough to email it and is never logged or persisted.
        OTPVerification otpVerification = new OTPVerification();
        otpVerification.setEmail(email);
        otpVerification.setOtpCode(passwordEncoder.encode(otp));
        otpVerification.setExpiryTime(LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES));
        otpVerification.setAttempts(0);
        otpVerification.setVerified(false);

        otpRepository.save(otpVerification);

        // In demo mode, skip email delivery and return the OTP to the caller so
        // it can be shown in the API response for testing/interview purposes.
        if (otpDemoMode) {
            return otp;
        }

        // Production mode: real SMTP delivery via EmailServiceImpl.
        emailService.sendOtpEmail(email, otp);
        return null;
    }

    @Override
    @Transactional
    public void verifyOtp(VerifyOtpRequest request) {
        OTPVerification otpVerification = otpRepository.findFirstByEmailOrderByCreatedAtDesc(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No OTP requested for this email"));

        if (otpVerification.getVerified()) {
            throw new RuntimeException("This OTP has already been verified or used.");
        }

        if (otpVerification.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }

        if (otpVerification.getAttempts() >= OTP_MAX_ATTEMPTS) {
            throw new RuntimeException("Maximum verification attempts (" + OTP_MAX_ATTEMPTS + ") exceeded. Please generate a new OTP.");
        }

        if (!passwordEncoder.matches(request.getOtpCode(), otpVerification.getOtpCode())) {
            otpVerification.setAttempts(otpVerification.getAttempts() + 1);
            otpRepository.save(otpVerification);

            int attemptsLeft = OTP_MAX_ATTEMPTS - otpVerification.getAttempts();
            if (attemptsLeft <= 0) {
                throw new RuntimeException("Maximum verification attempts exceeded. This OTP is now invalid. Please request a new one.");
            } else {
                throw new RuntimeException("Invalid OTP code. You have " + attemptsLeft + " attempt" + (attemptsLeft == 1 ? "" : "s") + " left.");
            }
        }

        otpVerification.setVerified(true);
        otpRepository.save(otpVerification);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New password and confirm password do not match.");
        }

        OTPVerification otpVerification = otpRepository.findFirstByEmailOrderByCreatedAtDesc(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No OTP details found"));

        if (!otpVerification.getVerified() || !passwordEncoder.matches(request.getOtpCode(), otpVerification.getOtpCode())) {
            throw new RuntimeException("OTP has not been verified. Please verify the OTP first.");
        }

        if (otpVerification.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP session expired. Please generate a new OTP.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Hash and update the password using BCrypt (same PasswordEncoder used
        // for login/registration/change-password).
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Invalidate the OTP immediately so it can never be reused, even for a
        // second reset-password call within the same 5-minute window.
        otpVerification.setVerified(false);
        otpVerification.setExpiryTime(LocalDateTime.now().minusSeconds(1));
        otpRepository.save(otpVerification);
    }
}
