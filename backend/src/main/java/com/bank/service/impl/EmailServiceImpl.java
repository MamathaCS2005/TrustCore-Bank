package com.bank.service.impl;

import com.bank.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Sends OTP emails via real SMTP using Spring's JavaMailSender.
 *
 * Configuration comes entirely from application.properties (spring.mail.*).
 * To go live with Gmail SMTP:
 *   spring.mail.host=smtp.gmail.com
 *   spring.mail.port=587
 *   spring.mail.username=<your-gmail-address>
 *   spring.mail.password=<16-character Gmail App Password, NOT your account password>
 *   spring.mail.properties.mail.smtp.auth=true
 *   spring.mail.properties.mail.smtp.starttls.enable=true
 * Gmail requires an "App Password" (Google Account > Security > 2-Step Verification >
 * App passwords) since regular account passwords are rejected by SMTP AUTH.
 *
 * Any other SMTP provider (Outlook365, SES, SendGrid SMTP relay, etc.) works the
 * same way - only the spring.mail.* values need to change.
 *
 * No development bypass exists here: if SMTP is unreachable or misconfigured,
 * sendOtpEmail() throws and the caller (AuthServiceImpl) surfaces a failure to
 * the user rather than silently continuing as if the email were delivered.
 */
@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendOtpEmail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(toEmail);
        message.setSubject("Online Banking - Password Reset OTP");
        message.setText(
                "Dear Customer,\n\n" +
                "Your 6-digit OTP code to reset your password is: " + otpCode + "\n\n" +
                "This OTP is valid for 5 minutes and can only be used once. " +
                "If you did not request this, please ignore this email or contact support.\n\n" +
                "Best regards,\nOnline Banking Team"
        );

        try {
            mailSender.send(message);
        } catch (MailException e) {
            // Do not leak SMTP internals to the client; log server-side for diagnosis.
            System.err.println("[EMAIL DELIVERY FAILED] to=" + toEmail + " reason=" + e.getMessage());
            throw new RuntimeException("Failed to send OTP email. Please try again later or contact support.", e);
        }
    }
}
