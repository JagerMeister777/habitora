package com.example.demo.user.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.user.dto.RegisterUserDto;
import com.example.demo.user.dto.UpdateUserDto;
import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;
import com.example.demo.utility.PasswordEncoder;

@Service
public class UserService {
	
	private final UserRepository repository;
	private final PasswordEncoder encoder;
	
	@Autowired
	public UserService(UserRepository repository, PasswordEncoder encoder) {
		this.repository = repository;
		this.encoder = encoder;
	}
	
	public List<User> getUsers() {
		return repository.findAll();
	}
	
	public Optional<User> findByUserId(Long id) {
		return repository.findById(id);
	}
	
	
	public String registUser(RegisterUserDto dto) {
		User registUser = new User(
				dto.getName(), 
				dto.getEmail(), 
				encoder.hash(dto.getPassword()), 
				dto.getNickname()
			);
		
		User saveUser = repository.save(registUser);
		return saveUser.getName();
	}
	
	public String updateUser(Long id, UpdateUserDto dto) {
		Optional<User> updateUser = findByUserId(id);
		if (updateUser.isPresent()) {
			updateUser.get().setName(dto.getName());
			updateUser.get().setEmail(dto.getEmail());
			updateUser.get().setNickname(dto.getNickname());
			updateUser.get().setPassword(dto.getPassword());
			repository.save(updateUser.get());
			return updateUser.get().getName() + " の情報を更新しました。";
		} else {
			return "ユーザーが見つかりませんでした。";
		}
	}
}
