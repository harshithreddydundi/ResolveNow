package com.resolvenow.auth.service;

import com.resolvenow.auth.dto.AuthResponse;
import com.resolvenow.auth.dto.LoginRequest;
import com.resolvenow.auth.dto.RegisterRequest;
import com.resolvenow.auth.dto.UserDto;
import com.resolvenow.auth.entity.Role;
import com.resolvenow.auth.entity.User;
import com.resolvenow.auth.exception.BadRequestException;
import com.resolvenow.auth.repository.UserRepository;
import com.resolvenow.auth.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Attempting login for email: {}", request.getEmail());
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Invalid password attempt for email: {}", request.getEmail());
            throw new BadCredentialsException("Invalid email or password");
        }

        if (Boolean.FALSE.equals(user.getEnabled())) {
            throw new BadRequestException("Account is disabled. Please contact administrator.");
        }

        String token = jwtUtil.generateToken(user);
        log.info("User logged in successfully: {} (Role: {})", user.getEmail(), user.getRole());
        return new AuthResponse(token, UserDto.fromEntity(user));
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Attempting registration for email: {}", request.getEmail());
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        Role role = request.getRole() != null ? request.getRole() : Role.CUSTOMER;

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getPhone(),
                role,
                request.getDepartment()
        );

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser);
        log.info("User registered successfully: id={}, email={}, role={}", savedUser.getId(), savedUser.getEmail(), savedUser.getRole());
        return new AuthResponse(token, UserDto.fromEntity(savedUser));
    }
}
