package com.example.demo.user.entity;

import java.time.LocalDateTime;

import com.example.demo.common.entity.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="users")
public class User extends BaseEntity {
	private String name;
	private String email;
	private String password;
	private String nickname;
	private LocalDateTime registeredAt;
	private Boolean isDeleted;
	
	public User() {}
	
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
		return "User [name=" + name + ", email=" + email + ", password=" + password + ", nickname=" + nickname
				+ ", registeredAt=" + registeredAt + ", isDeleted=" + isDeleted + ", id=" + id + "]";
	}
}
