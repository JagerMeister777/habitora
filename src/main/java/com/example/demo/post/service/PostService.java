package com.example.demo.post.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.post.dto.CreatePostDto;
import com.example.demo.post.entity.Post;
import com.example.demo.post.repository.PostRepository;

@Service
public class PostService {
	
	private final PostRepository repository;
	
	@Autowired
	public PostService(PostRepository repository) {
		this.repository = repository;
	}
	
	
	public void createPost(CreatePostDto dto) {
		// TODO modeロジック実装（別メソッドで共通化）
		// TODO modeをenumクラスで定義
		// TODO 天気をenumクラスで定義
		String mode = "";
		
		Post createPost = new Post(
				dto.getText(),
				dto.getFeelingScore(),
				mode,
				dto.getEmotionKeywords(),
				false,
				LocalDateTime.now()
			);
	}
}
