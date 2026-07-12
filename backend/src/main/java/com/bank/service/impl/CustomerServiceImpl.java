package com.bank.service.impl;

import com.bank.dto.AuthDTOs.EditProfileRequest;
import com.bank.dto.BeneficiaryDTOs.*;
import com.bank.dto.DashboardStatsDTOs.CustomerDashboardStats;
import com.bank.dto.FeedbackDTOs.*;
import com.bank.dto.KycDTOs.KycResponse;
import com.bank.dto.AccountDTO.AccountResponse;
import com.bank.dto.TransactionDTO.TransactionResponse;
import com.bank.entity.*;
import com.bank.repository.*;
import com.bank.service.CustomerService;
import com.bank.service.TransactionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final FeedbackRepository feedbackRepository;
    private final KYCRepository kycRepository;
    private final TransactionService transactionService;

    public CustomerServiceImpl(CustomerRepository customerRepository,
                               UserRepository userRepository,
                               AccountRepository accountRepository,
                               BeneficiaryRepository beneficiaryRepository,
                               FeedbackRepository feedbackRepository,
                               KYCRepository kycRepository,
                               TransactionService transactionService) {
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.beneficiaryRepository = beneficiaryRepository;
        this.feedbackRepository = feedbackRepository;
        this.kycRepository = kycRepository;
        this.transactionService = transactionService;
    }

    private Customer getCustomer(String username) {
        return customerRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerDashboardStats getDashboardStats(String username) {
        Customer customer = getCustomer(username);
        
        // Fetch accounts
        List<Account> accounts = accountRepository.findByCustomer(customer);
        List<AccountResponse> accountResponses = accounts.stream()
                .map(this::mapToAccountResponse)
                .collect(Collectors.toList());

        BigDecimal totalBalance = accounts.stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Fetch recent transactions
        List<TransactionResponse> recentTxns = transactionService.getTransactionHistory(username)
                .stream().limit(5).collect(Collectors.toList());

        // Fetch beneficiaries
        List<BeneficiaryResponse> beneficiaries = getBeneficiaries(username);

        return new CustomerDashboardStats(
                accountResponses,
                totalBalance,
                customer.getKycStatus(),
                recentTxns,
                beneficiaries,
                beneficiaries.size()
        );
    }

    @Override
    public Customer getCustomerProfile(String username) {
        return getCustomer(username);
    }

    @Override
    @Transactional
    public void updateProfile(String username, EditProfileRequest request) {
        Customer customer = getCustomer(username);
        User user = customer.getUser();

        // Check email uniqueness if modified
        if (!user.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());
        userRepository.save(user);

        customer.setFullName(request.getFullName());
        customer.setAddress(request.getAddress());
        customerRepository.save(customer);
    }

    @Override
    @Transactional
    public KycResponse uploadKyc(String username, String documentType, String documentNumber, String fileUrl) {
        Customer customer = getCustomer(username);

        // Check if KYC doc already exists for the customer, if yes update it
        KYC kyc = kycRepository.findByCustomer(customer).orElse(new KYC());
        kyc.setCustomer(customer);
        kyc.setDocumentType(documentType);
        kyc.setDocumentNumber(documentNumber);
        kyc.setDocumentUrl(fileUrl);
        kyc.setStatus("PENDING");
        kyc.setReviewedBy(null);
        kyc.setReviewedAt(null);
        kyc.setReviewRemarks(null);
        kyc = kycRepository.save(kyc);

        // Also update kycStatus on customer record
        customer.setKycStatus("PENDING");
        customerRepository.save(customer);

        return mapToKycResponse(kyc);
    }

    @Override
    public KycResponse getKycStatus(String username) {
        Customer customer = getCustomer(username);
        Optional<KYC> kycOpt = kycRepository.findByCustomer(customer);
        return kycOpt.map(this::mapToKycResponse).orElse(null);
    }

    @Override
    public List<BeneficiaryResponse> getBeneficiaries(String username) {
        return beneficiaryRepository.findByCustomerUserUsername(username).stream()
                .map(this::mapToBeneficiaryResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BeneficiaryResponse addBeneficiary(String username, BeneficiaryRequest request) {
        Customer customer = getCustomer(username);

        // Find beneficiary account
        Account beneficiaryAccount = accountRepository.findByAccountNumber(request.getBeneficiaryAccountNumber())
                .orElseThrow(() -> new RuntimeException("Beneficiary account number does not exist"));

        // Check if customer is adding themselves
        if (beneficiaryAccount.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException("You cannot add your own account as a beneficiary");
        }

        // Check if beneficiary is already added
        if (beneficiaryRepository.existsByCustomerAndBeneficiaryAccount(customer, beneficiaryAccount)) {
            throw new RuntimeException("This account is already in your beneficiary list");
        }

        Beneficiary beneficiary = new Beneficiary();
        beneficiary.setCustomer(customer);
        beneficiary.setBeneficiaryAccount(beneficiaryAccount);
        beneficiary.setName(request.getName());
        beneficiary = beneficiaryRepository.save(beneficiary);

        return mapToBeneficiaryResponse(beneficiary);
    }

    @Override
    @Transactional
    public void deleteBeneficiary(String username, Long beneficiaryId) {
        Customer customer = getCustomer(username);
        Beneficiary beneficiary = beneficiaryRepository.findById(beneficiaryId)
                .orElseThrow(() -> new RuntimeException("Beneficiary not found"));

        if (!beneficiary.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException("Unauthorized: You do not own this beneficiary record");
        }

        beneficiaryRepository.delete(beneficiary);
    }

    @Override
    @Transactional
    public void submitFeedback(String username, FeedbackRequest request) {
        Customer customer = getCustomer(username);

        Feedback feedback = new Feedback();
        feedback.setCustomer(customer);
        feedback.setSubject(request.getSubject());
        feedback.setMessage(request.getMessage());
        
        feedbackRepository.save(feedback);
    }

    @Override
    public List<FeedbackResponse> getFeedbackHistory(String username) {
        Customer customer = getCustomer(username);
        // We can just filter feedbacks by customer
        return feedbackRepository.findAll().stream()
                .filter(f -> f.getCustomer().getId().equals(customer.getId()))
                .map(this::mapToFeedbackResponse)
                .collect(Collectors.toList());
    }

    // Helper mappings
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

    private BeneficiaryResponse mapToBeneficiaryResponse(Beneficiary b) {
        return new BeneficiaryResponse(
                b.getId(),
                b.getName(),
                b.getBeneficiaryAccount().getAccountNumber(),
                b.getBeneficiaryAccount().getCustomer().getFullName(),
                b.getCreatedAt()
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
}
