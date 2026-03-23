package com.university.exception;

/**
 * Exception for access denied scenarios
 */
public class AccessDeniedException extends RuntimeException {
    public AccessDeniedException(String message) {
        super(message);
    }
}
