package com.example.demo.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.post.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

}
