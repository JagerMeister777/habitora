package com.example.demo.user.exception;

public class PasswordUnMatchException extends RuntimeException {
	public PasswordUnMatchException(String message) {
		super(message);
	}
}
