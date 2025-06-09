package com.example.demo.common.util;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Component;

@Component
public class PasswordEncoder {

	// パスワードハッシュ化
	public String hash(String plain) {
        return BCrypt.hashpw(plain, BCrypt.gensalt());
    }

	//パスワード比較
    public boolean verify(String plain, String hashed) {
        return BCrypt.checkpw(plain, hashed);
    }

}
