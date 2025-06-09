package com.example.demo.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.user.dto.UserRequestDto;
import com.example.demo.user.entity.User;
import com.example.demo.user.exception.PasswordUnMatchException;
import com.example.demo.user.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class UserController {
	
	private final UserService service;
	
	@Autowired
	public UserController(UserService service) {
		super();
		this.service = service;
	}
	
	@GetMapping("/users/{id}")
	public ResponseEntity<User> getUsers(@PathVariable Long id) {
		return ResponseEntity.ok(service.getUser(id));
	}

	@PostMapping("/users")
	public ResponseEntity<String> createUser(@RequestBody @Valid UserRequestDto dto) {
		if (dto.getPassword().equals(dto.getConfirmPass())) {
			String saveUserName = service.createUser(dto);
			return ResponseEntity.ok((saveUserName + "の登録が完了しました。"));
		} else {
			throw new PasswordUnMatchException("パスワードが一致しませんでした。"); 
		}
	}
	
	@PutMapping("/users/{id}")
	public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody @Valid UserRequestDto dto) {
		return ResponseEntity.ok(service.updateUser(id, dto));
	}
	
	@DeleteMapping("/users/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable Long id) {
		return ResponseEntity.ok(service.deleteUser(id));
	}
	
}
