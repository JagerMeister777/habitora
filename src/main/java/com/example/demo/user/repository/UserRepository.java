package com.example.demo.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.user.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long>{

	public boolean existsByEmail(String email);
}