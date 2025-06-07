package com.example.demo.common.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ErrorResponse {

  private int status;
  private String error;
  private String message;
  private String timeStamp;

  public ErrorResponse(int status, String error, String message, String timeStamp) {
    this.status = status;
    this.error = error;
    this.message = message;
    this.timeStamp = timeStamp;
  }

  /**
   * timestampのフォーマット
   *
   * @return yyyy-MM-dd HH:mm:ss形式の時刻
   */
  public static String formattedTimestamp() {
    LocalDateTime now = LocalDateTime.now();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    return now.format(formatter);
  }
}
