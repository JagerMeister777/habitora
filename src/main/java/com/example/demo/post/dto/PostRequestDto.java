package com.example.demo.post.dto;

import java.util.List;

import lombok.Getter;

@Getter
public class PostRequestDto {
	
	private String text;
	private Integer feelingScore;
	private List<String> emotionKeywords;
	
	public PostRequestDto(String text, Integer feelingScore, List<String> emotionKeywords) {
		this.text = text;
		this.feelingScore = feelingScore;
		this.emotionKeywords = emotionKeywords;
	}
}
