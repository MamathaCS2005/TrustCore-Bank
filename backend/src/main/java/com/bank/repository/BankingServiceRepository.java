package com.bank.repository;

import com.bank.entity.BankingService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BankingServiceRepository extends JpaRepository<BankingService, Long> {
    List<BankingService> findByStatus(String status);
}
