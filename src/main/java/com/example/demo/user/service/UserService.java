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
		return Optional.of(repository.findById(id).orElseThrow(() -> new UserNotFoundException("ユーザーが見つかり見つかりませんでした。")));
	}
	
	@Transactional
	public String createUser(UserRequestDto dto) {
		// TODO メールアドレス比較、既に登録されている情報であればregistedUserExceptionを発生させる。
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
			updateUser.get().setName(dto.getName());
			updateUser.get().setEmail(dto.getEmail());
			updateUser.get().setNickname(dto.getNickname());
			updateUser.get().setPassword(dto.getPassword());
			repository.save(updateUser.get());
			return updateUser.get().getName() + " の情報を更新しました。";
	}
	
	@Transactional
	public String deleteUser(Long id) {
		// TODO 本番は論理削除
		repository.deleteById(id);
		return "id : " + id + " を削除しました。";
	}
}
