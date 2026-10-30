package com.resolvenow.gateway.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;

@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationFilter.class);

    private final JwtUtil jwtUtil;

    private static final List<String> PUBLIC_PATH_PREFIXES = List.of(
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/departments",
            "/v3/api-docs",
            "/swagger-ui",
            "/swagger-resources",
            "/actuator"
    );

    public AuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        // 1. Always allow OPTIONS requests for browser CORS preflight
        if (request.getMethod() == HttpMethod.OPTIONS) {
            return chain.filter(exchange);
        }

        // 2. Allow whitelisted public endpoints without token
        if (isPublicPath(path)) {
            return chain.filter(exchange);
        }

        // 3. Verify Authorization Bearer header
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Unauthorized request to {}: Missing or invalid Authorization header", path);
            return onError(exchange, "Missing or invalid Authorization header. Bearer token required.", HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7).trim();

        // 4. Validate JWT Token Signature & Expiry
        if (!jwtUtil.validateToken(token)) {
            log.warn("Unauthorized request to {}: JWT token expired or signature invalid", path);
            return onError(exchange, "Expired or invalid JWT token. Please authenticate again.", HttpStatus.UNAUTHORIZED);
        }

        // 5. Extract user claims and propagate via downstream headers
        try {
            Long userId = jwtUtil.getUserId(token);
            String email = jwtUtil.getEmail(token);
            String role = jwtUtil.getRole(token);
            String name = jwtUtil.getName(token);
            String dept = jwtUtil.getDepartment(token);

            ServerHttpRequest.Builder builder = request.mutate()
                    .header("X-User-Id", userId != null ? String.valueOf(userId) : "")
                    .header("X-User-Email", email != null ? email : "")
                    .header("X-User-Role", role != null ? role : "")
                    .header("X-User-Name", name != null ? name : "")
                    .header("X-User-Department", dept != null ? dept : "");

            ServerHttpRequest mutatedRequest = builder.build();
            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        } catch (Exception e) {
            log.error("Error extracting JWT claims: {}", e.getMessage());
            return onError(exchange, "Failed to parse authentication token.", HttpStatus.UNAUTHORIZED);
        }
    }

    private boolean isPublicPath(String path) {
        for (String prefix : PUBLIC_PATH_PREFIXES) {
            if (path.startsWith(prefix)) {
                return true;
            }
        }
        return false;
    }

    private Mono<Void> onError(ServerWebExchange exchange, String errMessage, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String json = String.format(
                "{\"success\":false,\"message\":\"%s\",\"errorCode\":\"UNAUTHORIZED\",\"timestamp\":\"%s\"}",
                errMessage,
                Instant.now().toString()
        );

        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(bytes);
        return response.writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        return -1; // Execute before default routing filters
    }
}
