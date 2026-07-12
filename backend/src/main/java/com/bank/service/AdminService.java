package com.bank.service;

import com.bank.dto.AccountDTO.*;
import com.bank.dto.AuthDTOs.EditProfileRequest;
import com.bank.dto.AuthDTOs.RegisterRequest;
import com.bank.dto.DashboardStatsDTOs.AdminDashboardStats;
import com.bank.dto.FeedbackDTOs.FeedbackResponse;
import com.bank.dto.KycDTOs.KycResponse;
import com.bank.dto.KycDTOs.KycStatusUpdateRequest;
import com.bank.entity.BankingService;
import com.bank.entity.Customer;

import java.util.List;

public interface AdminService {
    AdminDashboardStats getDashboardStats();
    List<Customer> getAllCustomers();
    Customer addCustomer(RegisterRequest request);
    Customer updateCustomer(Long customerId, EditProfileRequest request);
    void deleteCustomer(Long customerId);
    
    List<KycResponse> getAllKycDocuments();
    void updateKycStatus(Long kycId, String adminUsername, KycStatusUpdateRequest request);
    
    List<BankingService> getAllBankingServices();
    BankingService addBankingService(BankingService service);
    BankingService updateBankingService(Long id, BankingService service);
    void deleteBankingService(Long id);
    
    List<AccountResponse> getAllAccounts();
    AccountResponse createBankAccount(CreateAccountRequest request);
    void updateAccountStatus(Long accountId, String status);
    
    List<FeedbackResponse> getAllFeedbacks();
    void deleteFeedback(Long id);
}
