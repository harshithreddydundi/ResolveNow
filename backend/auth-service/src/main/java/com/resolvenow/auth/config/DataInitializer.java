package com.resolvenow.auth.config;

import com.resolvenow.auth.entity.Role;
import com.resolvenow.auth.entity.User;
import com.resolvenow.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("No users found in database. Initializing default development seed users...");

            List<User> seedUsers = Arrays.asList(
                    // 1 ADMIN
                    new User("System Administrator", "admin@resolvenow.com", passwordEncoder.encode("Admin@123"), "+1-555-0100", Role.ADMIN, "Administration"),

                    // 2 DEPARTMENT MANAGERS
                    new User("Sarah Jenkins (Manager)", "manager.tech@resolvenow.com", passwordEncoder.encode("Manager@123"), "+1-555-0101", Role.DEPARTMENT_MANAGER, "Technical Support"),
                    new User("David Miller (Manager)", "manager.billing@resolvenow.com", passwordEncoder.encode("Manager@123"), "+1-555-0102", Role.DEPARTMENT_MANAGER, "Billing & Finance"),

                    // 5 AGENTS
                    new User("Alex Rivera (Tech L2)", "agent.tech1@resolvenow.com", passwordEncoder.encode("Agent@123"), "+1-555-0201", Role.AGENT, "Technical Support"),
                    new User("Emily Zhao (Tech L1)", "agent.tech2@resolvenow.com", passwordEncoder.encode("Agent@123"), "+1-555-0202", Role.AGENT, "Technical Support"),
                    new User("Marcus Vance (Billing)", "agent.billing1@resolvenow.com", passwordEncoder.encode("Agent@123"), "+1-555-0203", Role.AGENT, "Billing & Finance"),
                    new User("Chloe Bennett (Service)", "agent.service1@resolvenow.com", passwordEncoder.encode("Agent@123"), "+1-555-0204", Role.AGENT, "Customer Service"),
                    new User("Liam Cooper (Facility)", "agent.facility1@resolvenow.com", passwordEncoder.encode("Agent@123"), "+1-555-0205", Role.AGENT, "Facility"),

                    // 5 CUSTOMERS
                    new User("Alice Morgan", "customer1@resolvenow.com", passwordEncoder.encode("Customer@123"), "+1-555-0301", Role.CUSTOMER, null),
                    new User("Robert Hughes", "customer2@resolvenow.com", passwordEncoder.encode("Customer@123"), "+1-555-0302", Role.CUSTOMER, null),
                    new User("Jessica Tan", "customer3@resolvenow.com", passwordEncoder.encode("Customer@123"), "+1-555-0303", Role.CUSTOMER, null),
                    new User("Michael Brown", "customer4@resolvenow.com", passwordEncoder.encode("Customer@123"), "+1-555-0304", Role.CUSTOMER, null),
                    new User("Sophia Martinez", "customer5@resolvenow.com", passwordEncoder.encode("Customer@123"), "+1-555-0305", Role.CUSTOMER, null)
            );

            userRepository.saveAll(seedUsers);
            log.info("Successfully seeded {} development users into Auth Service.", seedUsers.size());
        }
    }
}
