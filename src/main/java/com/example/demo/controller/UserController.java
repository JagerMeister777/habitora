package com.example.demo.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Dto.RegisterUserDto;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;

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
	public ResponseEntity<String> registUser(@RequestBody RegisterUserDto dto) {
		if (dto.getPassword().equals(dto.getConfirmPass())) {
			User registerUser = service.registUser(dto);
			return ResponseEntity.ok((registerUser.getName() + "の登録が完了しました。"));
		} else {
			return ResponseEntity.ok(("パスワードが一致しません。"));
		}
		
	}
	
}
