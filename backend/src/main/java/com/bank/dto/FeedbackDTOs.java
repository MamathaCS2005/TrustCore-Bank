package com.bank.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class FeedbackDTOs {

    public static class FeedbackRequest {
        @NotBlank(message = "Subject is required")
        @Size(max = 150, message = "Subject must not exceed 150 characters")
        private String subject;

        @NotBlank(message = "Feedback message is required")
        private String message;

        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class FeedbackResponse {
        private Long id;
        private String customerName;
        private String customerUsername;
        private String subject;
        private String message;
        private LocalDateTime submittedAt;

        public FeedbackResponse() {}

        public FeedbackResponse(Long id, String customerName, String customerUsername, String subject, String message, LocalDateTime submittedAt) {
            this.id = id;
            this.customerName = customerName;
            this.customerUsername = customerUsername;
            this.subject = subject;
            this.message = message;
            this.submittedAt = submittedAt;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public String getCustomerUsername() { return customerUsername; }
        public void setCustomerUsername(String customerUsername) { this.customerUsername = customerUsername; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public LocalDateTime getSubmittedAt() { return submittedAt; }
        public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    }
}
