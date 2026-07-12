package com.bank.service;

public interface EmailService {
    void sendOtpEmail(String toEmail, String otpCode);
}
