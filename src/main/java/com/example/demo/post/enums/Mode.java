package com.example.demo.post.enums;

public enum Mode {
    LOW,     // feelingScore 1-3
    NEUTRAL, // feelingScore 4-6
    HIGH;    // feelingScore 7-10

    public static Mode from(int feelingScore) {
        if (feelingScore <= 3) return LOW;
        if (feelingScore <= 6) return NEUTRAL;
        return HIGH;
    }
}
