package com.bank.repository;

import com.bank.entity.Customer;
import com.bank.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByUser(User user);
    Optional<Customer> findByUserUsername(String username);
    Optional<Customer> findByUserEmail(String email);
    List<Customer> findByFullNameContainingIgnoreCase(String fullName);
    List<Customer> findByKycStatus(String kycStatus);
}
