package com.example.demo.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.common.util.PasswordEncoder;
import com.example.demo.user.dto.UserRequestDto;
import com.example.demo.user.dto.UserResponseDto;
import com.example.demo.user.entity.User;
import com.example.demo.user.exception.ExistsEmailException;
import com.example.demo.user.exception.UserIsDeletedException;
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

    public User getUser(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("ユーザーが見つかりませんでした。"));
        if (user.getIsDeleted()) {
            throw new UserIsDeletedException("ユーザーが削除されています。");
        }
        return user;
    }

    public UserResponseDto getUserResponse(Long id) {
        return new UserResponseDto(getUser(id));
    }

    @Transactional
    public String createUser(UserRequestDto dto) {
        if (repository.existsByEmail(dto.getEmail())) {
            throw new ExistsEmailException("既にメールアドレスが使われています。");
        }
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
    public UserResponseDto updateUser(Long id, UserRequestDto dto) {
        if (repository.existsByEmailAndIdNot(dto.getEmail(), id)) {
            throw new ExistsEmailException("既にメールアドレスが使われています。");
        }
        User updateUser = getUser(id);
        updateUser.setName(dto.getName());
        updateUser.setEmail(dto.getEmail());
        updateUser.setNickname(dto.getNickname());
        updateUser.setPassword(encoder.hash(dto.getPassword()));
        return new UserResponseDto(repository.save(updateUser));
    }

    @Transactional
    public String deleteUser(Long id) {
        User user = getUser(id);
        user.setIsDeleted(true);
        repository.save(user);
        return "id : " + id + " を削除しました。";
    }
}
