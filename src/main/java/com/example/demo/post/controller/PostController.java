package com.example.demo.post.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.post.dto.PostRequestDto;
import com.example.demo.post.entity.Post;
import com.example.demo.post.service.PostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/post")
public class PostController {
	
	private final PostService service;
	
	@Autowired
	public PostController(PostService service) {
		this.service = service;
	}
	
	@GetMapping("/{id}")
	public List<Post> getAllPost(@PathVariable Long userId) {
		return service.getPost(userId);
	}
	
	@PostMapping("/{id}")
	public ResponseEntity<String> createPost(@PathVariable Long userId, @RequestBody @Valid PostRequestDto dto) {
		service.createPost(dto, userId);
		return ResponseEntity.ok("今日の気持ちを投稿しました。誰かに届きますように。");
	}
}
