package com.bank.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionDTO {

    public static class DepositRequest {
        @NotBlank(message = "Account number is required")
        private String accountNumber;

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "1.00", message = "Minimum deposit amount is 1.00")
        private BigDecimal amount;

        private String description;

        public String getAccountNumber() { return accountNumber; }
        public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class WithdrawRequest {
        @NotBlank(message = "Account number is required")
        private String accountNumber;

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "1.00", message = "Minimum withdrawal amount is 1.00")
        private BigDecimal amount;

        private String description;

        public String getAccountNumber() { return accountNumber; }
        public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class TransferRequest {
        @NotBlank(message = "Source account number is required")
        private String sourceAccountNumber;

        @NotBlank(message = "Destination account number is required")
        private String destinationAccountNumber;

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "1.00", message = "Minimum transfer amount is 1.00")
        private BigDecimal amount;

        private String description;

        public String getSourceAccountNumber() { return sourceAccountNumber; }
        public void setSourceAccountNumber(String sourceAccountNumber) { this.sourceAccountNumber = sourceAccountNumber; }
        public String getDestinationAccountNumber() { return destinationAccountNumber; }
        public void setDestinationAccountNumber(String destinationAccountNumber) { this.destinationAccountNumber = destinationAccountNumber; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class TransactionResponse {
        private Long id;
        private String transactionRef;
        private String sourceAccountNumber;
        private String destinationAccountNumber;
        private String sourceCustomerName;
        private String destinationCustomerName;
        private BigDecimal amount;
        private String transactionType;
        private String status;
        private String description;
        private LocalDateTime timestamp;

        public TransactionResponse() {}

        public TransactionResponse(Long id, String transactionRef, String sourceAccountNumber, String destinationAccountNumber, 
                                   String sourceCustomerName, String destinationCustomerName, BigDecimal amount, 
                                   String transactionType, String status, String description, LocalDateTime timestamp) {
            this.id = id;
            this.transactionRef = transactionRef;
            this.sourceAccountNumber = sourceAccountNumber;
            this.destinationAccountNumber = destinationAccountNumber;
            this.sourceCustomerName = sourceCustomerName;
            this.destinationCustomerName = destinationCustomerName;
            this.amount = amount;
            this.transactionType = transactionType;
            this.status = status;
            this.description = description;
            this.timestamp = timestamp;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTransactionRef() { return transactionRef; }
        public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }
        public String getSourceAccountNumber() { return sourceAccountNumber; }
        public void setSourceAccountNumber(String sourceAccountNumber) { this.sourceAccountNumber = sourceAccountNumber; }
        public String getDestinationAccountNumber() { return destinationAccountNumber; }
        public void setDestinationAccountNumber(String destinationAccountNumber) { this.destinationAccountNumber = destinationAccountNumber; }
        public String getSourceCustomerName() { return sourceCustomerName; }
        public void setSourceCustomerName(String sourceCustomerName) { this.sourceCustomerName = sourceCustomerName; }
        public String getDestinationCustomerName() { return destinationCustomerName; }
        public void setDestinationCustomerName(String destinationCustomerName) { this.destinationCustomerName = destinationCustomerName; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getTransactionType() { return transactionType; }
        public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }
}
