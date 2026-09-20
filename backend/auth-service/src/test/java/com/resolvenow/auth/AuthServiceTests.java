package com.resolvenow.auth;

import com.resolvenow.auth.dto.AuthResponse;
import com.resolvenow.auth.dto.LoginRequest;
import com.resolvenow.auth.dto.RegisterRequest;
import com.resolvenow.auth.dto.UserDto;
import com.resolvenow.auth.entity.Role;
import com.resolvenow.auth.entity.User;
import com.resolvenow.auth.exception.BadRequestException;
import com.resolvenow.auth.repository.UserRepository;
import com.resolvenow.auth.security.JwtUtil;
import com.resolvenow.auth.service.AuthService;
import com.resolvenow.auth.service.UserService;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AuthServiceTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        // DataInitializer runs on startup and seeds admin, managers, agents, customers.
    }

    @Test
    void testAdminUserSeeded() {
        assertTrue(userRepository.existsByEmail("admin@resolvenow.com"));
        User admin = userRepository.findByEmail("admin@resolvenow.com").orElse(null);
        assertNotNull(admin);
        assertEquals(Role.ADMIN, admin.getRole());
        assertTrue(passwordEncoder.matches("Admin@123", admin.getPassword()));
    }

    @Test
    void testSuccessfulLogin() {
        LoginRequest login = new LoginRequest("admin@resolvenow.com", "Admin@123");
        AuthResponse response = authService.login(login);
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("admin@resolvenow.com", response.getUser().getEmail());
        assertEquals(Role.ADMIN, response.getUser().getRole());

        // Validate JWT Claims
        assertTrue(jwtUtil.validateToken(response.getToken()));
        Claims claims = jwtUtil.getClaimsFromToken(response.getToken());
        assertEquals("admin@resolvenow.com", claims.getSubject());
        assertEquals("ADMIN", claims.get("role"));
    }

    @Test
    void testInvalidPasswordLoginThrowsException() {
        LoginRequest login = new LoginRequest("admin@resolvenow.com", "WrongPassword!999");
        assertThrows(BadCredentialsException.class, () -> authService.login(login));
    }

    @Test
    void testRegisterNewCustomer() {
        RegisterRequest register = new RegisterRequest(
                "New Test Customer",
                "test.newcust@resolvenow.com",
                "Secret@123",
                "+1-555-9999",
                Role.CUSTOMER,
                null
        );

        AuthResponse response = authService.register(register);
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("test.newcust@resolvenow.com", response.getUser().getEmail());

        // Verify in DB
        User userInDb = userRepository.findByEmail("test.newcust@resolvenow.com").orElse(null);
        assertNotNull(userInDb);
        assertEquals("New Test Customer", userInDb.getName());
        assertTrue(passwordEncoder.matches("Secret@123", userInDb.getPassword()));
    }

    @Test
    void testDuplicateEmailRegistrationThrowsException() {
        RegisterRequest register = new RegisterRequest(
                "Duplicate Admin",
                "admin@resolvenow.com",
                "Admin@123",
                "+1-555-0000",
                Role.ADMIN,
                "Administration"
        );

        assertThrows(BadRequestException.class, () -> authService.register(register));
    }

    @Test
    void testGetUserByIdAndEmail() {
        User admin = userRepository.findByEmail("admin@resolvenow.com").orElseThrow();
        UserDto dtoById = userService.getUserById(admin.getId());
        UserDto dtoByEmail = userService.getUserByEmail("admin@resolvenow.com");

        assertEquals(admin.getId(), dtoById.getId());
        assertEquals("admin@resolvenow.com", dtoByEmail.getEmail());
    }
}
