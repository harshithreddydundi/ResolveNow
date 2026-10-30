package com.resolvenow.gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey secretKey;

    public JwtUtil(
            @Value("${jwt.secret:ResolveNowEnterpriseSuperSecretKeyForJWTSigningAndVerification2026!@#}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            return claims.getExpiration() == null || claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public String getEmail(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    public Long getUserId(String token) {
        Object idObj = getClaimsFromToken(token).get("id");
        if (idObj instanceof Number) {
            return ((Number) idObj).longValue();
        } else if (idObj != null) {
            try {
                return Long.parseLong(idObj.toString());
            } catch (NumberFormatException ignored) {
            }
        }
        return null;
    }

    public String getRole(String token) {
        Object roleObj = getClaimsFromToken(token).get("role");
        return roleObj != null ? roleObj.toString() : null;
    }

    public String getName(String token) {
        Object nameObj = getClaimsFromToken(token).get("name");
        return nameObj != null ? nameObj.toString() : null;
    }

    public String getDepartment(String token) {
        Object deptObj = getClaimsFromToken(token).get("department");
        return deptObj != null ? deptObj.toString() : null;
    }
}
