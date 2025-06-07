package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.demo.common.dto.ErrorResponse;
import com.example.demo.user.exception.PasswordUnMatchException;
import com.example.demo.user.exception.UserNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(UserNotFoundException.class)
	public ResponseEntity<ErrorResponse> UserNotFoundException(UserNotFoundException ex) {
		ErrorResponse errorResponse = new ErrorResponse(
		        400,
		        "Bad Request",
		        ex.getMessage(),
		        ErrorResponse.formattedTimestamp()
		    );
		    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(PasswordUnMatchException.class)
	public ResponseEntity<ErrorResponse> PasswordUnMatchException(PasswordUnMatchException ex) {
		ErrorResponse errorResponse = new ErrorResponse(
		        400,
		        "Bad Request",
		        ex.getMessage(),
		        ErrorResponse.formattedTimestamp()
		    );
		    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}

}
