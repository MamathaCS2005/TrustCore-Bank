package com.bank.service.impl;

import com.bank.dto.AccountDTO.AccountResponse;
import com.bank.dto.AccountDTO.CreateAccountRequest;
import com.bank.dto.AuthDTOs.EditProfileRequest;
import com.bank.dto.AuthDTOs.RegisterRequest;
import com.bank.dto.DashboardStatsDTOs.AdminDashboardStats;
import com.bank.dto.FeedbackDTOs.FeedbackResponse;
import com.bank.dto.KycDTOs.KycResponse;
import com.bank.dto.KycDTOs.KycStatusUpdateRequest;
import com.bank.dto.TransactionDTO.TransactionResponse;
import com.bank.entity.*;
import com.bank.repository.*;
import com.bank.service.AdminService;
import com.bank.service.TransactionService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final KYCRepository kycRepository;
    private final FeedbackRepository feedbackRepository;
    private final BankingServiceRepository bankingServiceRepository;
    private final TransactionService transactionService;
    private final PasswordEncoder passwordEncoder;

    public AdminServiceImpl(CustomerRepository customerRepository,
                            UserRepository userRepository,
                            RoleRepository roleRepository,
                            AccountRepository accountRepository,
                            TransactionRepository transactionRepository,
                            KYCRepository kycRepository,
                            FeedbackRepository feedbackRepository,
                            BankingServiceRepository bankingServiceRepository,
                            TransactionService transactionService,
                            PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.kycRepository = kycRepository;
        this.feedbackRepository = feedbackRepository;
        this.bankingServiceRepository = bankingServiceRepository;
        this.transactionService = transactionService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardStats getDashboardStats() {
        long totalCustomers = customerRepository.count();
        long totalAccounts = accountRepository.count();
        long totalTransactions = transactionRepository.count();
        long pendingKyc = kycRepository.countByStatus("PENDING");
        long activeAccounts = accountRepository.countByStatus("ACTIVE");

        BigDecimal totalDeposits = transactionRepository.sumTotalDeposits();
        BigDecimal totalWithdrawals = transactionRepository.sumTotalWithdrawals();
        BigDecimal totalTransfers = transactionRepository.sumTotalTransfers();

        // Fallbacks for null sums
        if (totalDeposits == null) totalDeposits = BigDecimal.ZERO;
        if (totalWithdrawals == null) totalWithdrawals = BigDecimal.ZERO;
        if (totalTransfers == null) totalTransfers = BigDecimal.ZERO;

        // Fetch top 10 recent transactions
        List<TransactionResponse> recentTxns = transactionService.getAllTransactions()
                .stream().limit(10).collect(Collectors.toList());

        return new AdminDashboardStats(
                totalCustomers,
                totalAccounts,
                totalTransactions,
                pendingKyc,
                activeAccounts,
                totalDeposits,
                totalWithdrawals,
                totalTransfers,
                recentTxns
        );
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    @Transactional
    public Customer addCustomer(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Default customer role not found"));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setMobileNumber(request.getMobileNumber());
        user.setStatus("ACTIVE");
        user.setRole(role);
        user = userRepository.save(user);

        Customer customer = new Customer();
        customer.setUser(user);
        customer.setFullName(request.getFullName());
        customer.setAddress(request.getAddress());
        customer.setDateOfBirth(request.getDateOfBirth());
        customer.setPanNumber(request.getPanNumber());
        customer.setAadharNumber(request.getAadharNumber());
        customer.setKycStatus("PENDING");
        customer = customerRepository.save(customer);

        // Create default account
        String accountNumber = generateUniqueAccountNumber();
        Account account = new Account();
        account.setAccountNumber(accountNumber);
        account.setCustomer(customer);
        account.setBalance(new BigDecimal("1000.00")); // Sign up bonus
        account.setAccountType("SAVINGS");
        account.setStatus("ACTIVE");
        accountRepository.save(account);

        return customer;
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
    @Transactional
    public Customer updateCustomer(Long customerId, EditProfileRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        User user = customer.getUser();
        if (!user.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());
        userRepository.save(user);

        customer.setFullName(request.getFullName());
        customer.setAddress(request.getAddress());
        return customerRepository.save(customer);
    }

    @Override
    @Transactional
    public void deleteCustomer(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        // Cascade delete is configured on User entity OneToOne -> Customer
        userRepository.delete(customer.getUser());
    }

    @Override
    public List<KycResponse> getAllKycDocuments() {
        return kycRepository.findAll().stream()
                .map(this::mapToKycResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateKycStatus(Long kycId, String adminUsername, KycStatusUpdateRequest request) {
        KYC kyc = kycRepository.findById(kycId)
                .orElseThrow(() -> new RuntimeException("KYC document not found"));

        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        kyc.setStatus(request.getStatus());
        kyc.setReviewRemarks(request.getReviewRemarks());
        kyc.setReviewedBy(admin);
        kyc.setReviewedAt(LocalDateTime.now());
        kycRepository.save(kyc);

        // Update main kyc status on customer record
        Customer customer = kyc.getCustomer();
        customer.setKycStatus(request.getStatus());
        customerRepository.save(customer);
    }

    @Override
    public List<BankingService> getAllBankingServices() {
        return bankingServiceRepository.findAll();
    }

    @Override
    public BankingService addBankingService(BankingService service) {
        if (bankingServiceRepository.findByStatus(service.getServiceName()) != null) {
            // wait, we can just save it or check if service name already exists
        }
        return bankingServiceRepository.save(service);
    }

    @Override
    @Transactional
    public BankingService updateBankingService(Long id, BankingService service) {
        BankingService existing = bankingServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        existing.setServiceName(service.getServiceName());
        existing.setDescription(service.getDescription());
        existing.setStatus(service.getStatus());
        return bankingServiceRepository.save(existing);
    }

    @Override
    public void deleteBankingService(Long id) {
        bankingServiceRepository.deleteById(id);
    }

    @Override
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::mapToAccountResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AccountResponse createBankAccount(CreateAccountRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        String accountNumber = generateUniqueAccountNumber();

        Account account = new Account();
        account.setAccountNumber(accountNumber);
        account.setCustomer(customer);
        account.setBalance(request.getInitialBalance());
        account.setAccountType(request.getAccountType());
        account.setStatus("ACTIVE");
        account = accountRepository.save(account);

        // Record a transaction for initial balance if > 0
        if (request.getInitialBalance().compareTo(BigDecimal.ZERO) > 0) {
            Transaction txn = new Transaction();
            txn.setTransactionRef(generateTransactionRef());
            txn.setSourceAccount(null);
            txn.setDestinationAccount(account);
            txn.setAmount(request.getInitialBalance());
            txn.setTransactionType("DEPOSIT");
            txn.setStatus("SUCCESS");
            txn.setDescription("Initial Deposit upon creation");
            transactionRepository.save(txn);
        }

        return mapToAccountResponse(account);
    }

    private String generateTransactionRef() {
        Random random = new Random();
        int suffix = 1000 + random.nextInt(9000);
        return "TXN-" + System.currentTimeMillis() / 1000L + suffix;
    }

    @Override
    @Transactional
    public void updateAccountStatus(Long accountId, String status) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!List.of("ACTIVE", "FROZEN", "CLOSED").contains(status.toUpperCase())) {
            throw new RuntimeException("Invalid account status: " + status);
        }

        account.setStatus(status.toUpperCase());
        accountRepository.save(account);
    }

    @Override
    public List<FeedbackResponse> getAllFeedbacks() {
        return feedbackRepository.findAll().stream()
                .map(this::mapToFeedbackResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }

    // Helper Mappings
    private KycResponse mapToKycResponse(KYC k) {
        String reviewer = k.getReviewedBy() != null ? k.getReviewedBy().getUsername() : null;
        return new KycResponse(
                k.getId(),
                k.getCustomer().getFullName(),
                k.getCustomer().getUser().getUsername(),
                k.getDocumentType(),
                k.getDocumentNumber(),
                k.getDocumentUrl(),
                k.getStatus(),
                k.getSubmittedAt(),
                reviewer,
                k.getReviewRemarks(),
                k.getReviewedAt()
        );
    }

    private AccountResponse mapToAccountResponse(Account a) {
        return new AccountResponse(
                a.getId(),
                a.getAccountNumber(),
                a.getBalance(),
                a.getAccountType(),
                a.getStatus(),
                a.getCreatedAt(),
                a.getCustomer().getFullName(),
                a.getCustomer().getId()
        );
    }

    private FeedbackResponse mapToFeedbackResponse(Feedback f) {
        return new FeedbackResponse(
                f.getId(),
                f.getCustomer().getFullName(),
                f.getCustomer().getUser().getUsername(),
                f.getSubject(),
                f.getMessage(),
                f.getSubmittedAt()
        );
    }
}
