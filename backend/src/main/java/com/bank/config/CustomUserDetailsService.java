package com.bank.config;

import com.bank.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Standalone UserDetailsService bean.
 *
 * This MUST live outside SecurityConfig. If it were a @Bean method inside
 * SecurityConfig, and SecurityConfig's constructor also depends on
 * JwtAuthenticationFilter (which itself depends on UserDetailsService),
 * Spring ends up with a circular bean dependency:
 * SecurityConfig -> JwtAuthenticationFilter -> UserDetailsService -> SecurityConfig.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        com.bank.entity.User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        if ("FROZEN".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("Account is frozen. Please contact admin.");
        } else if ("CLOSED".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("Account is closed.");
        }

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().getName());

        return new User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }
}
