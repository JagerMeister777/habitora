package com.example.demo.Dto;

import lombok.Getter;

@Getter
public class RegisterUserDto {

	private String name;
	private String email;
	private String password;
	private String confirmPass;
	private String nickname;
	
	public RegisterUserDto(String name, String email, String password, String nickname, String confirmPass) {
		this.name = name;
		this.email = email;
		this.password = password;
		this.nickname = nickname;
		this.confirmPass = confirmPass;
	}
}
