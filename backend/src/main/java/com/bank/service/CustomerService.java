package com.bank.service;

import com.bank.dto.AuthDTOs.EditProfileRequest;
import com.bank.dto.BeneficiaryDTOs.*;
import com.bank.dto.FeedbackDTOs.*;
import com.bank.dto.KycDTOs.KycResponse;
import com.bank.dto.DashboardStatsDTOs.CustomerDashboardStats;
import com.bank.entity.Customer;
import com.bank.entity.KYC;

import java.util.List;

public interface CustomerService {
    CustomerDashboardStats getDashboardStats(String username);
    Customer getCustomerProfile(String username);
    void updateProfile(String username, EditProfileRequest request);
    KycResponse uploadKyc(String username, String documentType, String documentNumber, String fileUrl);
    KycResponse getKycStatus(String username);
    List<BeneficiaryResponse> getBeneficiaries(String username);
    BeneficiaryResponse addBeneficiary(String username, BeneficiaryRequest request);
    void deleteBeneficiary(String username, Long beneficiaryId);
    void submitFeedback(String username, FeedbackRequest request);
    List<FeedbackResponse> getFeedbackHistory(String username);
}
