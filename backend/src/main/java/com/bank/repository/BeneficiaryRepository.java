package com.bank.repository;

import com.bank.entity.Account;
import com.bank.entity.Beneficiary;
import com.bank.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
    List<Beneficiary> findByCustomer(Customer customer);
    List<Beneficiary> findByCustomerUserUsername(String username);
    boolean existsByCustomerAndBeneficiaryAccount(Customer customer, Account beneficiaryAccount);
}
