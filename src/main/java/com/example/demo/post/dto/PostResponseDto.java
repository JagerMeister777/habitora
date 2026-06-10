package com.example.demo.post.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.demo.post.entity.Post;
import com.example.demo.post.enums.Mode;

import lombok.Getter;

@Getter
public class PostResponseDto {

    private Long id;
    private Long userId;
    private String text;
    private Integer feelingScore;
    private Mode mode;
    private List<String> emotionKeywords;
    private Boolean isVisible;
    private LocalDateTime createdAt;

    public PostResponseDto(Post post) {
        this.id = post.getId();
        this.userId = post.getUserId();
        this.text = post.getText();
        this.feelingScore = post.getFeelingScore();
        this.mode = post.getMode();
        this.emotionKeywords = post.getEmotionKeywords();
        this.isVisible = post.getIsVisible();
        this.createdAt = post.getCreatedAt();
    }
}
