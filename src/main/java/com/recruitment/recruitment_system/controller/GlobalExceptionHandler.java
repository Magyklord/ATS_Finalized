
package com.recruitment.recruitment_system.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice //handles exceptions across rest controllers - all the other controller files
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class) //catches valdiation errors caused by @valid
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException exception) {

        Map<String, String> errors = new HashMap<>(); //initializing a hash map to record all the errors/exceptions

        exception.getBindingResult() //the core idea is to create a json response that shows the explanation for the error based on whatever it is
                .getFieldErrors() //this block basically specifies the error based on data from screeningresult.java
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errors);
    }

    //cleaner json error format handling
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleInvalidJson(
            HttpMessageNotReadableException exception) {

        Map<String, String> error = new HashMap<>();

        error.put("error", "Invalid request body");
        error.put("message", "Please send valid JSON with the correct field types.");

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(error);
    }

}
