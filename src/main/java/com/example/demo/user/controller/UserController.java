package com.example.demo.user.controller;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.user.dto.RegisterUserDto;
import com.example.demo.user.dto.UpdateUserDto;
import com.example.demo.user.entity.User;
import com.example.demo.user.service.UserService;

@RestController
@RequestMapping("/api")
public class UserController {
	
	private final UserService service;
	
	@Autowired
	public UserController(UserService service) {
		this.service = service;
	}
	
	@GetMapping("/users")
	public ResponseEntity<List<User>> getUsers() {
		return ResponseEntity.ok(service.getUsers());
	}
	
	@PostMapping("/users")
	public ResponseEntity<String> registUser(@RequestBody @Valid RegisterUserDto dto) {
		if (dto.getPassword().equals(dto.getConfirmPass())) {
			String saveUserName = service.registUser(dto);
			return ResponseEntity.ok((saveUserName + "の登録が完了しました。"));
		} else {
			return ResponseEntity.ok(("パスワードが一致しません。"));
		}
	}
	
	@PutMapping("/users/{id}")
	public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody @Valid UpdateUserDto dto) {
		return ResponseEntity.ok(service.updateUser(id, dto));
	}
	
}
