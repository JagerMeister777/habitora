package com.example.demo.post.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.common.entity.BaseEntity;
import com.example.demo.post.dto.PostRequestDto;
import com.example.demo.post.entity.Post;
import com.example.demo.post.repository.PostRepository;
import com.example.demo.user.service.UserService;

import jakarta.transaction.Transactional;

@Service
public class PostService {
	
	private final PostRepository repository;
	private final UserService userService;
	
	@Autowired
	public PostService(PostRepository repository, UserService service) {
		this.repository = repository;
		this.userService = service;
	}
	
	public List<Post> getPost(Long id) {
		return repository.findByUserId(id);
	}

	@Transactional
	public void createPost(PostRequestDto dto, Long userId) {
		// TODO modeロジック実装（別メソッドで共通化）
		// TODO modeをenumクラスで定義
		// TODO 天気をenumクラスで定義
		BaseEntity user = userService.findByUser(userId);
		String mode = "";
		
		Post createPost = new Post(
				user.getId(),
				dto.getText(),
				dto.getFeelingScore(),
				mode,
				dto.getEmotionKeywords(),
				false,
				LocalDateTime.now()
			);
		repository.save(createPost);
	}
}
