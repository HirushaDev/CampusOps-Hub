package com.Authentication.BACKEND.Util;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret.key}")
     private String SECRET_KEY;

     public String generateToken(UserDetails userDetails) {
         Map<String , Object> cliams = new HashMap<>();
         return createToken(cliams, userDetails.getUsername());
     }

    private String createToken(Map<String, Object> cliams, String email) {
       return  Jwts.builder()
                .setClaims(cliams)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) //10 hour expiration
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }
}
