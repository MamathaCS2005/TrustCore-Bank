package com.bank.config;

import com.bank.entity.Role;
import com.bank.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Ensures the mandatory roles (ROLE_ADMIN, ROLE_CUSTOMER) exist at startup.
 * Registration/admin-creation flows depend on these rows being present;
 * this guards against a freshly created schema (ddl-auto=update) that
 * hasn't been seeded via database/data.sql.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));
        roleRepository.findByName("ROLE_CUSTOMER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_CUSTOMER")));
    }
}
