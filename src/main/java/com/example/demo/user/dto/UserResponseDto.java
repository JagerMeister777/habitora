package com.example.demo.user.dto;

public class UserResponseDto {
	
	private String nickname;
	private String email;
	
	public UserResponseDto(String nickname, String email) {
		super();
		this.nickname = nickname;
		this.email = email;
	}
}
