package com.example.demo.utility;

import org.mindrot.jbcrypt.BCrypt;

public class PasswordEncoder {

	// パスワードハッシュ化
	public static String hash(String plain) {
        return BCrypt.hashpw(plain, BCrypt.gensalt());
    }

	//パスワード比較
    public static boolean verify(String plain, String hashed) {
        return BCrypt.checkpw(plain, hashed);
    }

}
