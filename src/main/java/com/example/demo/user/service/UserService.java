package com.example.demo.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.common.util.PasswordEncoder;
import com.example.demo.user.dto.UserRequestDto;
import com.example.demo.user.entity.User;
import com.example.demo.user.exception.ExistsEmailException;
import com.example.demo.user.exception.UserIsDeletedException;
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
	
	public User findByUser(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new UserNotFoundException("ユーザーが見つかり見つかりませんでした。"));
	}
	
	public User getUser(Long id) {
		User user = findByUser(id);
		if (user.getIsDeleted()) {
			throw new UserIsDeletedException("ユーザーが削除されています。");
		} else {
			return user;
		}
	}
	
	@Transactional
	public String createUser(UserRequestDto dto) {
		isExistsEmail(dto.getEmail());
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
		isExistsEmail(dto.getEmail());
		User updateUser = getUser(id);
			updateUser.setName(dto.getName());
			updateUser.setEmail(dto.getEmail());
			updateUser.setNickname(dto.getNickname());
			updateUser.setPassword(encoder.hash(dto.getPassword()));
			repository.save(updateUser);
			return updateUser.getName() + " の情報を更新しました。";
	}
	
	@Transactional
	public String deleteUser(Long id) {
		User user = getUser(id);
		user.setIsDeleted(true);
		repository.save(user);
		return "id : " + id + " を削除しました。";
	}
	
	public void isExistsEmail(String email) {
		if (repository.existsByEmail(email)) {
			throw new ExistsEmailException("既にメールアドレスが使われています。");
		}
	}
}
