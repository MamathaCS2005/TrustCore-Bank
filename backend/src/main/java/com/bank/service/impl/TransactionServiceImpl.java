package com.bank.service.impl;

import com.bank.dto.TransactionDTO.*;
import com.bank.entity.Account;
import com.bank.entity.Customer;
import com.bank.entity.Transaction;
import com.bank.repository.AccountRepository;
import com.bank.repository.CustomerRepository;
import com.bank.repository.TransactionRepository;
import com.bank.service.TransactionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository,
                                  AccountRepository accountRepository,
                                  CustomerRepository customerRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public TransactionResponse deposit(DepositRequest request) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!"ACTIVE".equals(account.getStatus())) {
            throw new RuntimeException("Account is not active (currently: " + account.getStatus() + ")");
        }

        // Perform Deposit
        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        // Record Transaction
        Transaction transaction = new Transaction();
        transaction.setTransactionRef(generateTransactionRef());
        transaction.setSourceAccount(null);
        transaction.setDestinationAccount(account);
        transaction.setAmount(request.getAmount());
        transaction.setTransactionType("DEPOSIT");
        transaction.setStatus("SUCCESS");
        transaction.setDescription(request.getDescription() != null ? request.getDescription() : "Self Deposit");
        transaction = transactionRepository.save(transaction);

        return mapToResponse(transaction);
    }

    @Override
    @Transactional
    public TransactionResponse withdraw(String username, WithdrawRequest request) {
        Customer customer = customerRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));

        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Validate Ownership
        if (!account.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException("Unauthorized: You do not own this account");
        }

        if (!"ACTIVE".equals(account.getStatus())) {
            throw new RuntimeException("Account is not active (currently: " + account.getStatus() + ")");
        }

        // Check sufficient balance
        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // Perform Withdrawal
        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        // Record Transaction
        Transaction transaction = new Transaction();
        transaction.setTransactionRef(generateTransactionRef());
        transaction.setSourceAccount(account);
        transaction.setDestinationAccount(null);
        transaction.setAmount(request.getAmount());
        transaction.setTransactionType("WITHDRAWAL");
        transaction.setStatus("SUCCESS");
        transaction.setDescription(request.getDescription() != null ? request.getDescription() : "Cash Withdrawal");
        transaction = transactionRepository.save(transaction);

        return mapToResponse(transaction);
    }

    @Override
    @Transactional
    public TransactionResponse transfer(String username, TransferRequest request) {
        Customer customer = customerRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));

        Account source = accountRepository.findByAccountNumber(request.getSourceAccountNumber())
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        Account destination = accountRepository.findByAccountNumber(request.getDestinationAccountNumber())
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        // Validate Ownership of source
        if (!source.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException("Unauthorized: You do not own the source account");
        }

        if (!"ACTIVE".equals(source.getStatus())) {
            throw new RuntimeException("Source account is not active (currently: " + source.getStatus() + ")");
        }

        if (!"ACTIVE".equals(destination.getStatus())) {
            throw new RuntimeException("Destination account is not active (currently: " + destination.getStatus() + ")");
        }

        if (source.getAccountNumber().equals(destination.getAccountNumber())) {
            throw new RuntimeException("Source and destination accounts cannot be the same");
        }

        // Check sufficient balance
        if (source.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // Perform Transfer
        source.setBalance(source.getBalance().subtract(request.getAmount()));
        destination.setBalance(destination.getBalance().add(request.getAmount()));

        accountRepository.save(source);
        accountRepository.save(destination);

        // Record Transaction
        Transaction transaction = new Transaction();
        transaction.setTransactionRef(generateTransactionRef());
        transaction.setSourceAccount(source);
        transaction.setDestinationAccount(destination);
        transaction.setAmount(request.getAmount());
        transaction.setTransactionType("TRANSFER");
        transaction.setStatus("SUCCESS");
        transaction.setDescription(request.getDescription() != null ? request.getDescription() : "Funds Transfer");
        transaction = transactionRepository.save(transaction);

        return mapToResponse(transaction);
    }

    @Override
    public List<TransactionResponse> getTransactionHistory(String username) {
        Customer customer = customerRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));

        List<Transaction> list = transactionRepository.findHistoryByCustomer(customer.getId());
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<TransactionResponse> getTransactionHistoryByAccount(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        List<Transaction> list = transactionRepository.findHistoryByAccount(account);
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void reverseTransaction(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if ("REVERSED".equals(transaction.getStatus())) {
            throw new RuntimeException("Transaction is already reversed");
        }

        if (!"SUCCESS".equals(transaction.getStatus())) {
            throw new RuntimeException("Only successful transactions can be reversed");
        }

        String type = transaction.getTransactionType();
        Account src = transaction.getSourceAccount();
        Account dest = transaction.getDestinationAccount();
        BigDecimal amt = transaction.getAmount();

        if ("DEPOSIT".equals(type) && dest != null) {
            // Reverse a deposit: subtract from destination
            if (dest.getBalance().compareTo(amt) < 0) {
                throw new RuntimeException("Cannot reverse deposit: insufficient destination account balance");
            }
            dest.setBalance(dest.getBalance().subtract(amt));
            accountRepository.save(dest);
        } else if ("WITHDRAWAL".equals(type) && src != null) {
            // Reverse withdrawal: add back to source
            src.setBalance(src.getBalance().add(amt));
            accountRepository.save(src);
        } else if ("TRANSFER".equals(type) && src != null && dest != null) {
            // Reverse transfer: debit destination, credit source
            if (dest.getBalance().compareTo(amt) < 0) {
                throw new RuntimeException("Cannot reverse transfer: insufficient destination account balance");
            }
            dest.setBalance(dest.getBalance().subtract(amt));
            src.setBalance(src.getBalance().add(amt));
            accountRepository.save(dest);
            accountRepository.save(src);
        } else {
            throw new RuntimeException("Reversal logic not configured for transaction type: " + type);
        }

        // Mark original transaction as reversed
        transaction.setStatus("REVERSED");
        transactionRepository.save(transaction);

        // Create reversal transaction record
        Transaction reversal = new Transaction();
        reversal.setTransactionRef(generateTransactionRef() + "-REV");
        reversal.setSourceAccount(dest); // opposite of original
        reversal.setDestinationAccount(src);
        reversal.setAmount(amt);
        reversal.setTransactionType("REVERSAL");
        reversal.setStatus("SUCCESS");
        reversal.setDescription("Reversal of transaction: " + transaction.getTransactionRef());
        transactionRepository.save(reversal);
    }

    private String generateTransactionRef() {
        Random random = new Random();
        int suffix = 1000 + random.nextInt(9000);
        return "TXN-" + System.currentTimeMillis() / 1000L + suffix;
    }

    private TransactionResponse mapToResponse(Transaction t) {
        String srcAcc = t.getSourceAccount() != null ? t.getSourceAccount().getAccountNumber() : null;
        String destAcc = t.getDestinationAccount() != null ? t.getDestinationAccount().getAccountNumber() : null;

        String srcName = t.getSourceAccount() != null && t.getSourceAccount().getCustomer() != null ?
                t.getSourceAccount().getCustomer().getFullName() : null;

        String destName = t.getDestinationAccount() != null && t.getDestinationAccount().getCustomer() != null ?
                t.getDestinationAccount().getCustomer().getFullName() : null;

        return new TransactionResponse(
                t.getId(),
                t.getTransactionRef(),
                srcAcc,
                destAcc,
                srcName,
                destName,
                t.getAmount(),
                t.getTransactionType(),
                t.getStatus(),
                t.getDescription(),
                t.getTimestamp()
        );
    }
}
