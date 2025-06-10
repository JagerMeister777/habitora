package com.example.demo.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.common.util.PasswordEncoder;
import com.example.demo.user.dto.UserRequestDto;
import com.example.demo.user.dto.UserResponseDto;
import com.example.demo.user.entity.User;
import com.example.demo.user.exception.ExistsEmailException;
import com.example.demo.user.exception.PasswordUnMatchException;
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
	public UserResponseDto createUser(UserRequestDto dto) {
		if (isPasswordUnMatching(dto)) {
			throw new PasswordUnMatchException("パスワードが一致しませんでした。");
		} else if(isExistsEmail(dto.getEmail())) {
			throw new ExistsEmailException("既にメールアドレスが使われています。");
		}
		User registUser = new User(
				dto.getName(), 
				dto.getEmail(), 
				encoder.hash(dto.getPassword()), 
				dto.getNickname()
			);
		User saveUser = repository.save(registUser);
		return new UserResponseDto(saveUser.getNickname(), saveUser.getEmail());
	}
	
	@Transactional
	public UserResponseDto updateUser(Long id, UserRequestDto dto) {
		if (isExistsEmail(id, dto.getEmail())) {
			throw new ExistsEmailException("既にメールアドレスが使われています。");
		};
		User updateUser = getUser(id);
			updateUser.setName(dto.getName());
			updateUser.setEmail(dto.getEmail());
			updateUser.setNickname(dto.getNickname());
			updateUser.setPassword(encoder.hash(dto.getPassword()));
			repository.save(updateUser);
			return new UserResponseDto(updateUser.getNickname(), updateUser.getEmail());
	}
	
	@Transactional
	public String deleteUser(Long id) {
		User user = getUser(id);
		user.setIsDeleted(true);
		repository.save(user);
		return "id : " + id + " を削除しました。";
	}
	
	public boolean isPasswordUnMatching(UserRequestDto dto) {
		return dto.getPassword().equals(dto.getConfirmPass()) ? false : true;
	}
	
	public boolean isExistsEmail(String email) {
		return repository.existsByEmail(email) ? true : false;
	}
	
	public boolean isExistsEmail(Long userId, String email) {
		String exsiteEmail = getUser(userId).getEmail();
		return !exsiteEmail.equals(email) && isExistsEmail(email) ? true : false;
	}
}
