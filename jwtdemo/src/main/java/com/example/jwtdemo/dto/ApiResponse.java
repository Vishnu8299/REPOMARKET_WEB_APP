package com.example.jwtdemo.dto;

public class ApiResponse<T> {
    private T data;
    private String message;
    private boolean success;
    private int status;

    public ApiResponse(T data, String message, boolean success, int status) {
        this.data = data;
        this.message = message;
        this.success = success;
        this.status = status;
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(data, message, true, 200);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(null, message, false, 400);
    }

    // Getters and setters
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
}
