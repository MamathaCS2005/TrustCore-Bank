package com.bank.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class KycDTOs {

    public static class KycUploadRequest {
        @NotBlank(message = "Document type is required")
        private String documentType; // PAN, AADHAR, PASSPORT

        @NotBlank(message = "Document number is required")
        private String documentNumber;

        public String getDocumentType() { return documentType; }
        public void setDocumentType(String documentType) { this.documentType = documentType; }
        public String getDocumentNumber() { return documentNumber; }
        public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }
    }

    public static class KycStatusUpdateRequest {
        @NotBlank(message = "Status is required")
        @Pattern(regexp = "^(APPROVED|REJECTED)$", message = "KYC status must be APPROVED or REJECTED")
        private String status;

        private String reviewRemarks;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getReviewRemarks() { return reviewRemarks; }
        public void setReviewRemarks(String reviewRemarks) { this.reviewRemarks = reviewRemarks; }
    }

    public static class KycResponse {
        private Long id;
        private String customerName;
        private String customerUsername;
        private String documentType;
        private String documentNumber;
        private String documentUrl;
        private String status;
        private LocalDateTime submittedAt;
        private String reviewedByUsername;
        private String reviewRemarks;
        private LocalDateTime reviewedAt;

        public KycResponse() {}

        public KycResponse(Long id, String customerName, String customerUsername, String documentType, String documentNumber, 
                           String documentUrl, String status, LocalDateTime submittedAt, String reviewedByUsername, 
                           String reviewRemarks, LocalDateTime reviewedAt) {
            this.id = id;
            this.customerName = customerName;
            this.customerUsername = customerUsername;
            this.documentType = documentType;
            this.documentNumber = documentNumber;
            this.documentUrl = documentUrl;
            this.status = status;
            this.submittedAt = submittedAt;
            this.reviewedByUsername = reviewedByUsername;
            this.reviewRemarks = reviewRemarks;
            this.reviewedAt = reviewedAt;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public String getCustomerUsername() { return customerUsername; }
        public void setCustomerUsername(String customerUsername) { this.customerUsername = customerUsername; }
        public String getDocumentType() { return documentType; }
        public void setDocumentType(String documentType) { this.documentType = documentType; }
        public String getDocumentNumber() { return documentNumber; }
        public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }
        public String getDocumentUrl() { return documentUrl; }
        public void setDocumentUrl(String documentUrl) { this.documentUrl = documentUrl; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public LocalDateTime getSubmittedAt() { return submittedAt; }
        public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
        public String getReviewedByUsername() { return reviewedByUsername; }
        public void setReviewedByUsername(String reviewedByUsername) { this.reviewedByUsername = reviewedByUsername; }
        public String getReviewRemarks() { return reviewRemarks; }
        public void setReviewRemarks(String reviewRemarks) { this.reviewRemarks = reviewRemarks; }
        public LocalDateTime getReviewedAt() { return reviewedAt; }
        public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
    }
}
