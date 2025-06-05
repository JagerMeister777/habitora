package com.example.demo.post.dto;

import java.util.List;

import lombok.Getter;

@Getter
public class CreatePostDto {
	
	private Long userId;
	private String text;
	private Integer feelingScore;
	private List<String> emotionKeywords;
	
	public CreatePostDto(Long userId, String text, Integer feelingScore, List<String> emotionKeywords) {
		this.userId = userId;
		this.text = text;
		this.feelingScore = feelingScore;
		this.emotionKeywords = emotionKeywords;
	}
}
