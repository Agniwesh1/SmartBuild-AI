package com.smartbuildai.exception;

public class HouseNotFoundException extends RuntimeException {

    public HouseNotFoundException(String message) {
        super(message);
    }
}