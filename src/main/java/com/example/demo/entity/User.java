package com.example.demo.entity;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User extends BaseEntity {
	private String name;
	private String email;
	private String password;
	private String nickname;
	private LocalDateTime registeredAt;
	private Boolean isDeleted;
	
	public User(String name, String email, String password, String nickname) {
		this.name = name;
		this.email = email;
		this.password = password;
		this.nickname = nickname;
		this.registeredAt = LocalDateTime.now();
		this.isDeleted = false;
	}
	
	@Override
	public String toString() {
		return super.toString() + 
				"名前 : " + name + 
				" | メールアドレス : " + email + 
				" | ニックネーム : " + nickname + 
				" | 登録日 : " + registeredAt;
	}
}
