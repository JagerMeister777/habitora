package com.example.demo.controller;

import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.User;

@RestController
@RequestMapping("/api")
public class UserController {
	
	@GetMapping("/users")
	private String getUsers() {
		User user = new User("shoji","sample.com","shoji1234","庄司",LocalDateTime.now());
		return user.toString();
	}
}
