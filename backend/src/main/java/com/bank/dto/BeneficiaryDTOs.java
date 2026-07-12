package com.bank.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class BeneficiaryDTOs {

    public static class BeneficiaryRequest {
        @NotBlank(message = "Beneficiary account number is required")
        private String beneficiaryAccountNumber;

        @NotBlank(message = "Nickname or name is required")
        @Size(max = 100, message = "Name must not exceed 100 characters")
        private String name;

        public String getBeneficiaryAccountNumber() { return beneficiaryAccountNumber; }
        public void setBeneficiaryAccountNumber(String beneficiaryAccountNumber) { this.beneficiaryAccountNumber = beneficiaryAccountNumber; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class BeneficiaryResponse {
        private Long id;
        private String name;
        private String beneficiaryAccountNumber;
        private String beneficiaryCustomerName;
        private LocalDateTime createdAt;

        public BeneficiaryResponse() {}

        public BeneficiaryResponse(Long id, String name, String beneficiaryAccountNumber, String beneficiaryCustomerName, LocalDateTime createdAt) {
            this.id = id;
            this.name = name;
            this.beneficiaryAccountNumber = beneficiaryAccountNumber;
            this.beneficiaryCustomerName = beneficiaryCustomerName;
            this.createdAt = createdAt;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getBeneficiaryAccountNumber() { return beneficiaryAccountNumber; }
        public void setBeneficiaryAccountNumber(String beneficiaryAccountNumber) { this.beneficiaryAccountNumber = beneficiaryAccountNumber; }
        public String getBeneficiaryCustomerName() { return beneficiaryCustomerName; }
        public void setBeneficiaryCustomerName(String beneficiaryCustomerName) { this.beneficiaryCustomerName = beneficiaryCustomerName; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}
