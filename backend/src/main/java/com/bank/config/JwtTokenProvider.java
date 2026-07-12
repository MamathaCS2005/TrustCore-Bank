package com.bank.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-milliseconds}")
    private long jwtExpirationDate;

    @Value("${app.jwt.remember-me-expiration-milliseconds:2592000000}") // default 30 days
    private long jwtRememberMeExpirationDate;

    private SecretKey getSigningKey() {
        byte[] keyBytes = this.jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate JWT token using the standard (short) expiration
    public String generateToken(Authentication authentication) {
        return generateToken(authentication, false);
    }

    // Generate JWT token, optionally using the extended "Remember Me" expiration
    public String generateToken(Authentication authentication, boolean rememberMe) {
        String username = authentication.getName();
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        long validityMillis = rememberMe ? jwtRememberMeExpirationDate : jwtExpirationDate;
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + validityMillis);

        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .claim("rememberMe", rememberMe)
                .issuedAt(new Date())
                .expiration(expireDate)
                .signWith(getSigningKey())
                .compact();
    }

    // Get username from JWT token
    public String getUsername(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    // Validate JWT token
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (MalformedJwtException e) {
            System.err.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.err.println("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.println("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }
}
