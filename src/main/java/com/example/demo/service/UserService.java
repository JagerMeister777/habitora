package com.example.demo.service;

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

        users.add(new User("田中一郎", "tanaka@example.com", PasswordEncoder.hash("hashed_pw_001"), "いっちゃん"));
        users.add(new User("鈴木花子", "suzuki@example.com", PasswordEncoder.hash("hashed_pw_002"), "ハナ"));
        users.add(new User("佐藤次郎", "sato@example.com", PasswordEncoder.hash("hashed_pw_003"), "ジロ"));
        users.add(new User("山田太郎", "yamada@example.com", PasswordEncoder.hash("hashed_pw_004"), "たろちゃん"));
        users.add(new User("小林美咲", "kobayashi@example.com", PasswordEncoder.hash("hashed_pw_005"), "ミサ"));

        return users;
	}
	
	
	public User registUser(RegisterUserDto dto) {
		User registUser = new User(
				dto.getName(), 
				dto.getEmail(), 
				PasswordEncoder.hash(dto.getPassword()), 
				dto.getNickname()
			);
		
		//TODO リポジトリへ保存処理の記述
		
		return registUser;
	}
}
