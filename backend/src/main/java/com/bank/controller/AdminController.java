package com.bank.controller;

import com.bank.dto.AccountDTO.*;
import com.bank.dto.AuthDTOs.ChangePasswordRequest;
import com.bank.dto.AuthDTOs.EditProfileRequest;
import com.bank.dto.AuthDTOs.RegisterRequest;
import com.bank.dto.DashboardStatsDTOs.AdminDashboardStats;
import com.bank.dto.FeedbackDTOs.FeedbackResponse;
import com.bank.dto.KycDTOs.KycResponse;
import com.bank.dto.KycDTOs.KycStatusUpdateRequest;
import com.bank.entity.BankingService;
import com.bank.entity.Customer;
import com.bank.service.AdminService;
import com.bank.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final AuthService authService;

    public AdminController(AdminService adminService, AuthService authService) {
        this.adminService = adminService;
        this.authService = authService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardStats> getDashboard() {
        AdminDashboardStats stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    // Customer Management
    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> list = adminService.getAllCustomers();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/customers")
    public ResponseEntity<Customer> addCustomer(@Valid @RequestBody RegisterRequest request) {
        Customer customer = adminService.addCustomer(request);
        return ResponseEntity.ok(customer);
    }

    @PutMapping("/customers/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable("id") Long id, @Valid @RequestBody EditProfileRequest request) {
        Customer customer = adminService.updateCustomer(id, request);
        return ResponseEntity.ok(customer);
    }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable("id") Long id) {
        adminService.deleteCustomer(id);
        return ResponseEntity.ok(Map.of("message", "Customer deleted successfully."));
    }

    // KYC Management
    @GetMapping("/kyc")
    public ResponseEntity<List<KycResponse>> getAllKyc() {
        List<KycResponse> list = adminService.getAllKycDocuments();
        return ResponseEntity.ok(list);
    }

    @PutMapping("/kyc/{id}")
    public ResponseEntity<?> updateKycStatus(@PathVariable("id") Long id,
                                             Principal principal,
                                             @Valid @RequestBody KycStatusUpdateRequest request) {
        adminService.updateKycStatus(id, principal.getName(), request);
        return ResponseEntity.ok(Map.of("message", "KYC status updated successfully."));
    }

    // Banking Services
    @GetMapping("/services")
    public ResponseEntity<List<BankingService>> getAllServices() {
        List<BankingService> list = adminService.getAllBankingServices();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/services")
    public ResponseEntity<BankingService> addService(@Valid @RequestBody BankingService service) {
        BankingService created = adminService.addBankingService(service);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<BankingService> updateService(@PathVariable("id") Long id, @Valid @RequestBody BankingService service) {
        BankingService updated = adminService.updateBankingService(id, service);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<?> deleteService(@PathVariable("id") Long id) {
        adminService.deleteBankingService(id);
        return ResponseEntity.ok(Map.of("message", "Banking service deleted successfully."));
    }

    // Bank Account Management
    @GetMapping("/accounts")
    public ResponseEntity<List<AccountResponse>> getAllAccounts() {
        List<AccountResponse> list = adminService.getAllAccounts();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/accounts")
    public ResponseEntity<AccountResponse> createBankAccount(@Valid @RequestBody CreateAccountRequest request) {
        AccountResponse response = adminService.createBankAccount(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/accounts/{id}/status")
    public ResponseEntity<?> updateAccountStatus(@PathVariable("id") Long id, @RequestParam("status") String status) {
        adminService.updateAccountStatus(id, status);
        return ResponseEntity.ok(Map.of("message", "Account status updated successfully to " + status));
    }

    // Feedbacks
    @GetMapping("/feedback")
    public ResponseEntity<List<FeedbackResponse>> getAllFeedbacks() {
        List<FeedbackResponse> list = adminService.getAllFeedbacks();
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/feedback/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable("id") Long id) {
        adminService.deleteFeedback(id);
        return ResponseEntity.ok(Map.of("message", "Feedback deleted successfully."));
    }

    // Profile Settings
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(Principal principal, @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(principal.getName(), request);
        return ResponseEntity.ok(Map.of("message", "Admin password changed successfully."));
    }
}
