package com.bank.service;

import com.bank.dto.TransactionDTO.*;
import java.util.List;

public interface TransactionService {
    TransactionResponse deposit(DepositRequest request);
    TransactionResponse withdraw(String username, WithdrawRequest request);
    TransactionResponse transfer(String username, TransferRequest request);
    List<TransactionResponse> getTransactionHistory(String username);
    List<TransactionResponse> getTransactionHistoryByAccount(String accountNumber);
    List<TransactionResponse> getAllTransactions();
    void reverseTransaction(Long transactionId);
}
