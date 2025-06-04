package com.example.demo.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Dto.CreatePostDto;
import com.example.demo.entity.Post;
import com.example.demo.repository.PostRepository;

@Service
public class PostService {
	
	private final PostRepository repository;
	
	@Autowired
	public PostService(PostRepository repository) {
		this.repository = repository;
	}
	
	
	public void createPost(CreatePostDto dto) {
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
