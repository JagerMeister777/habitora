package com.example.demo.post.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.example.demo.common.entity.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="post")
public class Post extends BaseEntity {
	private Long userId;
	private String text;
	private Integer feelingScore;
	private String mode;
	private List<String> emotionKeywords;
	private Boolean isVisible;
	private LocalDateTime createdAt;
	
	public Post() {}
	
	// TODO userIdを追加
	public Post(Long userId, String text, Integer feelingScore, String mode, List<String> emotionKeywords, Boolean isVisible, LocalDateTime createdAt) {
		this.userId  = userId;
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
