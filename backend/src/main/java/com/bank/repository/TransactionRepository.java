package com.bank.repository;

import com.bank.entity.Account;
import com.bank.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByTransactionRef(String transactionRef);
    
    @Query("SELECT t FROM Transaction t WHERE t.sourceAccount = :account OR t.destinationAccount = :account ORDER BY t.timestamp DESC")
    List<Transaction> findHistoryByAccount(@Param("account") Account account);

    @Query("SELECT t FROM Transaction t WHERE t.sourceAccount.customer.id = :customerId OR t.destinationAccount.customer.id = :customerId ORDER BY t.timestamp DESC")
    List<Transaction> findHistoryByCustomer(@Param("customerId") Long customerId);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.transactionType = 'DEPOSIT' AND t.status = 'SUCCESS'")
    BigDecimal sumTotalDeposits();

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.transactionType = 'WITHDRAWAL' AND t.status = 'SUCCESS'")
    BigDecimal sumTotalWithdrawals();

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.transactionType = 'TRANSFER' AND t.status = 'SUCCESS'")
    BigDecimal sumTotalTransfers();
}
