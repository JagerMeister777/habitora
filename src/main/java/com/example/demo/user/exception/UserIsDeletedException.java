package com.example.demo.user.exception;

public class UserIsDeletedException extends RuntimeException {
	public UserIsDeletedException(String message) {
		super(message);
	}
}
