package com.university.exception;

/**
 * Exception for duplicate resource scenarios
 */
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
