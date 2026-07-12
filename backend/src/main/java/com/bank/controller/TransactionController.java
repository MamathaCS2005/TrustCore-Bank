package com.bank.controller;

import com.bank.dto.TransactionDTO.*;
import com.bank.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // Deposit into an account (e.g. cash deposit / self deposit)
    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(@Valid @RequestBody DepositRequest request) {
        TransactionResponse response = transactionService.deposit(request);
        return ResponseEntity.ok(response);
    }

    // Withdraw from the authenticated customer's own account
    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(Principal principal, @Valid @RequestBody WithdrawRequest request) {
        TransactionResponse response = transactionService.withdraw(principal.getName(), request);
        return ResponseEntity.ok(response);
    }

    // Transfer funds from the authenticated customer's own account to another account
    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(Principal principal, @Valid @RequestBody TransferRequest request) {
        TransactionResponse response = transactionService.transfer(principal.getName(), request);
        return ResponseEntity.ok(response);
    }

    // Transaction history for the currently authenticated customer
    @GetMapping("/history")
    public ResponseEntity<List<TransactionResponse>> getMyHistory(Principal principal) {
        List<TransactionResponse> history = transactionService.getTransactionHistory(principal.getName());
        return ResponseEntity.ok(history);
    }

    // Admin-only: transaction history for any account number
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/history/account/{accountNumber}")
    public ResponseEntity<List<TransactionResponse>> getHistoryByAccount(@PathVariable("accountNumber") String accountNumber) {
        List<TransactionResponse> history = transactionService.getTransactionHistoryByAccount(accountNumber);
        return ResponseEntity.ok(history);
    }

    // Admin-only: view all transactions across the system
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
        List<TransactionResponse> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    // Admin-only: reverse a completed transaction
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/reverse")
    public ResponseEntity<?> reverseTransaction(@PathVariable("id") Long id) {
        transactionService.reverseTransaction(id);
        return ResponseEntity.ok(Map.of("message", "Transaction reversed successfully."));
    }
}
