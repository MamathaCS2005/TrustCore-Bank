package com.bank.controller;

import com.bank.dto.AuthDTOs.ChangePasswordRequest;
import com.bank.dto.AuthDTOs.EditProfileRequest;
import com.bank.dto.BeneficiaryDTOs.BeneficiaryRequest;
import com.bank.dto.BeneficiaryDTOs.BeneficiaryResponse;
import com.bank.dto.DashboardStatsDTOs.CustomerDashboardStats;
import com.bank.dto.FeedbackDTOs.FeedbackRequest;
import com.bank.dto.FeedbackDTOs.FeedbackResponse;
import com.bank.dto.KycDTOs.KycResponse;
import com.bank.entity.Customer;
import com.bank.service.AuthService;
import com.bank.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    private final CustomerService customerService;
    private final AuthService authService;

    public CustomerController(CustomerService customerService, AuthService authService) {
        this.customerService = customerService;
        this.authService = authService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<CustomerDashboardStats> getDashboard(Principal principal) {
        CustomerDashboardStats stats = customerService.getDashboardStats(principal.getName());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/profile")
    public ResponseEntity<Customer> getProfile(Principal principal) {
        Customer profile = customerService.getCustomerProfile(principal.getName());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Principal principal, @Valid @RequestBody EditProfileRequest request) {
        customerService.updateProfile(principal.getName(), request);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully."));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(Principal principal, @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(principal.getName(), request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
    }

    // KYC Upload (using multipart/form-data)
    @PostMapping("/kyc/upload")
    public ResponseEntity<KycResponse> uploadKyc(Principal principal,
                                                 @RequestParam("documentType") String documentType,
                                                 @RequestParam("documentNumber") String documentNumber,
                                                 @RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Please upload a valid document file.");
        }

        // Ensure uploads directory exists
        File uploadDir = new File("uploads");
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Generate safe name
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9.-]", "_");
        java.nio.file.Path filePath = Paths.get("uploads", fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = "uploads/" + fileName;

        KycResponse response = customerService.uploadKyc(principal.getName(), documentType, documentNumber, fileUrl);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/kyc/status")
    public ResponseEntity<KycResponse> getKyc(Principal principal) {
        KycResponse response = customerService.getKycStatus(principal.getName());
        return ResponseEntity.ok(response);
    }

    // Beneficiaries
    @GetMapping("/beneficiaries")
    public ResponseEntity<List<BeneficiaryResponse>> getBeneficiaries(Principal principal) {
        List<BeneficiaryResponse> list = customerService.getBeneficiaries(principal.getName());
        return ResponseEntity.ok(list);
    }

    @PostMapping("/beneficiaries")
    public ResponseEntity<BeneficiaryResponse> addBeneficiary(Principal principal, @Valid @RequestBody BeneficiaryRequest request) {
        BeneficiaryResponse response = customerService.addBeneficiary(principal.getName(), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/beneficiaries/{id}")
    public ResponseEntity<?> deleteBeneficiary(Principal principal, @PathVariable("id") Long id) {
        customerService.deleteBeneficiary(principal.getName(), id);
        return ResponseEntity.ok(Map.of("message", "Beneficiary removed successfully."));
    }

    // Feedback
    @PostMapping("/feedback")
    public ResponseEntity<?> submitFeedback(Principal principal, @Valid @RequestBody FeedbackRequest request) {
        customerService.submitFeedback(principal.getName(), request);
        return ResponseEntity.ok(Map.of("message", "Feedback submitted successfully. Thank you!"));
    }

    @GetMapping("/feedback")
    public ResponseEntity<List<FeedbackResponse>> getFeedbackHistory(Principal principal) {
        List<FeedbackResponse> list = customerService.getFeedbackHistory(principal.getName());
        return ResponseEntity.ok(list);
    }
}
