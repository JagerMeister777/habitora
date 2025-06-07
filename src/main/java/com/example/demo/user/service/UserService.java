package com.example.demo.user.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.common.util.PasswordEncoder;
import com.example.demo.user.dto.UserRequestDto;
import com.example.demo.user.entity.User;
import com.example.demo.user.exception.UserNotFoundException;
import com.example.demo.user.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {
	
	private final UserRepository repository;
	private final PasswordEncoder encoder;
	
	@Autowired
	public UserService(UserRepository repository, PasswordEncoder encoder) {
		this.repository = repository;
		this.encoder = encoder;
	}
	
	public Optional<User> getUser(Long id) {
		return repository.findById(id);
	}
	
	@Transactional
	public String createUser(UserRequestDto dto) {
		User registUser = new User(
				dto.getName(), 
				dto.getEmail(), 
				encoder.hash(dto.getPassword()), 
				dto.getNickname()
			);
		
		User saveUser = repository.save(registUser);
		return saveUser.getName();
	}
	
	@Transactional
	public String updateUser(Long id, UserRequestDto dto) {
		Optional<User> updateUser = getUser(id);
		if (updateUser.isPresent()) {
			updateUser.get().setName(dto.getName());
			updateUser.get().setEmail(dto.getEmail());
			updateUser.get().setNickname(dto.getNickname());
			updateUser.get().setPassword(dto.getPassword());
			repository.save(updateUser.get());
			return updateUser.get().getName() + " の情報を更新しました。";
		} else {
			throw new UserNotFoundException("ユーザーが見つかりませんでした。");
		}
	}
	
	@Transactional
	public String deleteUser(Long id) {
		// TODO 本番は論理削除
		repository.deleteById(id);
		return "id : " + id + " を削除しました。";
	}
}
