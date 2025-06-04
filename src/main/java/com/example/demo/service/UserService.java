package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Dto.RegisterUserDto;
import com.example.demo.entity.User;
import com.example.demo.utility.PasswordEncoder;

@Service
public class UserService {
	
	public List<User> getUsers() {
		// TODO データベースへ格納し、リポジトリから呼び出し
		List<User> users = new ArrayList<>();

        users.add(new User("田中一郎", "tanaka@example.com", PasswordEncoder.hash("hashed_pw_001"), "いっちゃん", LocalDateTime.of(2023, 1, 15, 10, 30)));
        users.add(new User("鈴木花子", "suzuki@example.com", PasswordEncoder.hash("hashed_pw_002"), "ハナ", LocalDateTime.of(2023, 2, 20, 14, 10)));
        users.add(new User("佐藤次郎", "sato@example.com", PasswordEncoder.hash("hashed_pw_003"), "ジロ", LocalDateTime.of(2023, 3, 25, 9, 0)));
        users.add(new User("山田太郎", "yamada@example.com", PasswordEncoder.hash("hashed_pw_004"), "たろちゃん", LocalDateTime.of(2024, 5, 1, 16, 45)));
        users.add(new User("小林美咲", "kobayashi@example.com", PasswordEncoder.hash("hashed_pw_005"), "ミサ", LocalDateTime.of(2024, 11, 3, 8, 20)));

        return users;
	}
	
	
	public User registUser(RegisterUserDto user) {
		User registUser = new User(
				user.getName(), 
				user.getEmail(), 
				PasswordEncoder.hash(user.getPassword()), 
				user.getNickname(), 
				LocalDateTime.now());
		
		//TODO リポジトリへ保存処理の記述
		
		return registUser;
	}
}
