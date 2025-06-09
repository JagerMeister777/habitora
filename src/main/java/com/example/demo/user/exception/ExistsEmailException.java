package com.example.demo.user.exception;

public class ExistsEmailException extends RuntimeException {
	public ExistsEmailException(String message) {
		super(message);
	}
}
