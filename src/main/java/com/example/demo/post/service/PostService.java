package com.example.demo.post.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.post.dto.CreatePostDto;
import com.example.demo.post.dto.PostResponseDto;
import com.example.demo.post.dto.UpdatePostDto;
import com.example.demo.post.entity.Post;
import com.example.demo.post.enums.Mode;
import com.example.demo.post.exception.PostNotFoundException;
import com.example.demo.post.repository.PostRepository;
import com.example.demo.user.service.UserService;

import jakarta.transaction.Transactional;

@Service
public class PostService {

    private final PostRepository repository;
    private final UserService userService;

    @Autowired
    public PostService(PostRepository repository, UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }

    @Transactional
    public PostResponseDto createPost(CreatePostDto dto) {
        userService.getUser(dto.getUserId());

        Mode mode = resolveMode(dto.getFeelingScore());

        Post post = new Post(
                dto.getUserId(),
                dto.getText(),
                dto.getFeelingScore(),
                mode,
                dto.getEmotionKeywords(),
                false,
                LocalDateTime.now()
        );

        return new PostResponseDto(repository.save(post));
    }

    public PostResponseDto getPost(Long id) {
        return new PostResponseDto(findPost(id));
    }

    public List<PostResponseDto> getPostsByUser(Long userId) {
        userService.getUser(userId);
        return repository.findByUserId(userId).stream()
                .map(PostResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public PostResponseDto updatePost(Long id, UpdatePostDto dto) {
        Post post = findPost(id);

        post.setText(dto.getText());
        post.setFeelingScore(dto.getFeelingScore());
        post.setMode(resolveMode(dto.getFeelingScore()));
        post.setEmotionKeywords(dto.getEmotionKeywords());
        if (dto.getIsVisible() != null) {
            post.setIsVisible(dto.getIsVisible());
        }

        return new PostResponseDto(repository.save(post));
    }

    @Transactional
    public String deletePost(Long id) {
        findPost(id);
        repository.deleteById(id);
        return "id : " + id + " の投稿を削除しました。";
    }

    private Post findPost(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new PostNotFoundException("投稿が見つかりませんでした。"));
    }

    private Mode resolveMode(int feelingScore) {
        return Mode.from(feelingScore);
    }
}
