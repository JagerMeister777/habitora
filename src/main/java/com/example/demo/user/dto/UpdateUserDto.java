package com.example.demo.user.dto;

import jakarta.validation.constraints.NotBlank;

import lombok.Getter;

@Getter
public class UpdateUserDto {

	@NotBlank
	private String name;
	@NotBlank
	private String email;
	@NotBlank
	private String password;
	@NotBlank
	private String confirmPass;
	private String nickname;
	
	public UpdateUserDto(String name, String email, String password, String nickname, String confirmPass) {
		this.name = name;
		this.email = email;
		this.password = password;
		this.nickname = nickname;
		this.confirmPass = confirmPass;
	}
}
