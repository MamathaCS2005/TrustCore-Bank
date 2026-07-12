package com.bank.repository;

import com.bank.entity.Customer;
import com.bank.entity.KYC;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface KYCRepository extends JpaRepository<KYC, Long> {
    Optional<KYC> findByCustomer(Customer customer);
    Optional<KYC> findByCustomerUserUsername(String username);
    List<KYC> findByStatus(String status);
    long countByStatus(String status);
}
