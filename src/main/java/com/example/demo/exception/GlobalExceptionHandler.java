//package com.example.demo.exception;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.RequestEntity;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.ErrorResponse;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//import com.example.demo.user.exception.UserNotFoundException;
//
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//	
//	@ExceptionHandler(UserNotFoundException.class)
//	public RequestEntity<ErrorResponse> UserNotFoundException(UserNotFoundException ex) {
//		ErrorResponse errorResponse = new ErrorResponse(
//		        400,
//		        "Bad Request",
//		        ex.getMessage(),
//		        ErrorResponse.class.
//		    );
//		    return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
//	}
//
//}
