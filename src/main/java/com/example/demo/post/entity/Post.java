package com.example.demo.post.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.example.demo.common.entity.BaseEntity;
import com.example.demo.post.enums.Mode;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "post")
public class Post extends BaseEntity {

    @Column(nullable = false)
    private Long userId;

    @Column(columnDefinition = "TEXT")
    private String text;

    @Column(nullable = false)
    private Integer feelingScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Mode mode;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "post_emotion_keywords", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "keyword")
    private List<String> emotionKeywords;

    @Column(nullable = false)
    private Boolean isVisible;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Post() {}

    public Post(Long userId, String text, Integer feelingScore, Mode mode, List<String> emotionKeywords, Boolean isVisible, LocalDateTime createdAt) {
        this.userId = userId;
        this.text = text;
        this.feelingScore = feelingScore;
        this.mode = mode;
        this.emotionKeywords = emotionKeywords;
        this.isVisible = isVisible;
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Post [userId=" + userId + ", text=" + text + ", feelingScore=" + feelingScore + ", mode=" + mode
                + ", emotionKeywords=" + emotionKeywords + ", isVisible=" + isVisible + ", createdAt=" + createdAt
                + ", id=" + id + "]";
    }
}
