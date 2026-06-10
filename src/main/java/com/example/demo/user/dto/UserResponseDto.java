package com.example.demo.user.dto;

import java.time.LocalDateTime;

import com.example.demo.user.entity.User;

import lombok.Getter;

@Getter
public class UserResponseDto {

    private Long id;
    private String name;
    private String email;
    private String nickname;
    private LocalDateTime registeredAt;

    public UserResponseDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.registeredAt = user.getRegisteredAt();
    }
}
