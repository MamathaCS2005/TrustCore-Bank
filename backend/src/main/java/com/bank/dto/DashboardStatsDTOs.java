package com.bank.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardStatsDTOs {

    public static class AdminDashboardStats {
        private long totalCustomers;
        private long totalAccounts;
        private long totalTransactions;
        private long pendingKyc;
        private long activeAccounts;
        private BigDecimal totalDeposits;
        private BigDecimal totalWithdrawals;
        private BigDecimal totalTransfers;
        private List<TransactionDTO.TransactionResponse> recentTransactions;

        public AdminDashboardStats() {}

        public AdminDashboardStats(long totalCustomers, long totalAccounts, long totalTransactions, long pendingKyc, 
                                   long activeAccounts, BigDecimal totalDeposits, BigDecimal totalWithdrawals, 
                                   BigDecimal totalTransfers, List<TransactionDTO.TransactionResponse> recentTransactions) {
            this.totalCustomers = totalCustomers;
            this.totalAccounts = totalAccounts;
            this.totalTransactions = totalTransactions;
            this.pendingKyc = pendingKyc;
            this.activeAccounts = activeAccounts;
            this.totalDeposits = totalDeposits;
            this.totalWithdrawals = totalWithdrawals;
            this.totalTransfers = totalTransfers;
            this.recentTransactions = recentTransactions;
        }

        // Getters and setters
        public long getTotalCustomers() { return totalCustomers; }
        public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }
        public long getTotalAccounts() { return totalAccounts; }
        public void setTotalAccounts(long totalAccounts) { this.totalAccounts = totalAccounts; }
        public long getTotalTransactions() { return totalTransactions; }
        public void setTotalTransactions(long totalTransactions) { this.totalTransactions = totalTransactions; }
        public long getPendingKyc() { return pendingKyc; }
        public void setPendingKyc(long pendingKyc) { this.pendingKyc = pendingKyc; }
        public long getActiveAccounts() { return activeAccounts; }
        public void setActiveAccounts(long activeAccounts) { this.activeAccounts = activeAccounts; }
        public BigDecimal getTotalDeposits() { return totalDeposits; }
        public void setTotalDeposits(BigDecimal totalDeposits) { this.totalDeposits = totalDeposits; }
        public BigDecimal getTotalWithdrawals() { return totalWithdrawals; }
        public void setTotalWithdrawals(BigDecimal totalWithdrawals) { this.totalWithdrawals = totalWithdrawals; }
        public BigDecimal getTotalTransfers() { return totalTransfers; }
        public void setTotalTransfers(BigDecimal totalTransfers) { this.totalTransfers = totalTransfers; }
        public List<TransactionDTO.TransactionResponse> getRecentTransactions() { return recentTransactions; }
        public void setRecentTransactions(List<TransactionDTO.TransactionResponse> recentTransactions) { this.recentTransactions = recentTransactions; }
    }

    public static class CustomerDashboardStats {
        private List<AccountDTO.AccountResponse> accounts;
        private BigDecimal totalBalance;
        private String kycStatus;
        private List<TransactionDTO.TransactionResponse> recentTransactions;
        private List<BeneficiaryDTOs.BeneficiaryResponse> beneficiaries;
        private long totalBeneficiaries;

        public CustomerDashboardStats() {}

        public CustomerDashboardStats(List<AccountDTO.AccountResponse> accounts, BigDecimal totalBalance, String kycStatus, 
                                      List<TransactionDTO.TransactionResponse> recentTransactions, 
                                      List<BeneficiaryDTOs.BeneficiaryResponse> beneficiaries, long totalBeneficiaries) {
            this.accounts = accounts;
            this.totalBalance = totalBalance;
            this.kycStatus = kycStatus;
            this.recentTransactions = recentTransactions;
            this.beneficiaries = beneficiaries;
            this.totalBeneficiaries = totalBeneficiaries;
        }

        // Getters and setters
        public List<AccountDTO.AccountResponse> getAccounts() { return accounts; }
        public void setAccounts(List<AccountDTO.AccountResponse> accounts) { this.accounts = accounts; }
        public BigDecimal getTotalBalance() { return totalBalance; }
        public void setTotalBalance(BigDecimal totalBalance) { this.totalBalance = totalBalance; }
        public String getKycStatus() { return kycStatus; }
        public void setKycStatus(String kycStatus) { this.kycStatus = kycStatus; }
        public List<TransactionDTO.TransactionResponse> getRecentTransactions() { return recentTransactions; }
        public void setRecentTransactions(List<TransactionDTO.TransactionResponse> recentTransactions) { this.recentTransactions = recentTransactions; }
        public List<BeneficiaryDTOs.BeneficiaryResponse> getBeneficiaries() { return beneficiaries; }
        public void setBeneficiaries(List<BeneficiaryDTOs.BeneficiaryResponse> beneficiaries) { this.beneficiaries = beneficiaries; }
        public long getTotalBeneficiaries() { return totalBeneficiaries; }
        public void setTotalBeneficiaries(long totalBeneficiaries) { this.totalBeneficiaries = totalBeneficiaries; }
    }
}
