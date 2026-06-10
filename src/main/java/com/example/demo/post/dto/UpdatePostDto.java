package com.example.demo.post.dto;

import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class UpdatePostDto {

    @NotBlank
    private String text;

    @NotNull
    @Min(1)
    @Max(10)
    private Integer feelingScore;

    private List<String> emotionKeywords;

    private Boolean isVisible;

    public UpdatePostDto(String text, Integer feelingScore, List<String> emotionKeywords, Boolean isVisible) {
        this.text = text;
        this.feelingScore = feelingScore;
        this.emotionKeywords = emotionKeywords;
        this.isVisible = isVisible;
    }
}
