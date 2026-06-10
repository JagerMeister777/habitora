package com.example.demo.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.auth.dto.LoginRequestDto;
import com.example.demo.common.util.PasswordEncoder;
import com.example.demo.user.dto.UserResponseDto;
import com.example.demo.user.entity.User;
import com.example.demo.user.exception.PasswordUnMatchException;
import com.example.demo.user.exception.UserNotFoundException;
import com.example.demo.user.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    public UserResponseDto login(LoginRequestDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new UserNotFoundException("メールアドレスまたはパスワードが正しくありません。"));

        if (user.getIsDeleted()) {
            throw new UserNotFoundException("メールアドレスまたはパスワードが正しくありません。");
        }

        if (!encoder.verify(dto.getPassword(), user.getPassword())) {
            throw new PasswordUnMatchException("メールアドレスまたはパスワードが正しくありません。");
        }

        return new UserResponseDto(user);
    }
}
