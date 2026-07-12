package com.bank.service;

import com.bank.dto.AuthDTOs.*;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    void register(RegisterRequest request);
    void changePassword(String username, ChangePasswordRequest request);
    /**
     * Initiates the forgot-password OTP flow.
     * @return the plaintext OTP if demo mode is enabled (for testing), null otherwise.
     */
    String initiateForgotPassword(ForgotPasswordRequest request);
    void verifyOtp(VerifyOtpRequest request);
    void resetPassword(ResetPasswordRequest request);
}
