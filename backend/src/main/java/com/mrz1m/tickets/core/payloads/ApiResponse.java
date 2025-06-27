package com.mrz1m.tickets.core.payloads;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.Map;

// Non includere campi null nella serializzazione JSON
@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
public class ApiResponse<T> {

    private final OffsetDateTime timestamp;
    private final int statusCode;
    private final String status;
    private final String message;
    private final T payload;
    private final Map<String, ?> errorDetails;

    // Costruttore privato per forzare l'uso dei metodi factory statici
    private ApiResponse(int statusCode, String status, String message, T payload, Map<String, ?> errorDetails) {
        this.timestamp = OffsetDateTime.now();
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
        this.payload = payload;
        this.errorDetails = errorDetails;
    }

    // --- Metodi Factory per Risposte di Successo ---

    public static <T> ApiResponse<T> success(int statusCode, String status, String message, T payload) {
        return new ApiResponse<>(statusCode, status, message, payload, null);
    }

    public static <T> ApiResponse<T> ok(String message, T payload) {
        return success(200, "OK", message, payload);
    }

    public static <T> ApiResponse<T> created(String message, T payload) {
        return success(201, "Created", message, payload);
    }

    public static ApiResponse<Void> noContent(String message) {
        return success(204, "No Content", message, null);
    }

    // --- Metodi Factory per Risposte di Errore ---

    public static <T> ApiResponse<T> error(int statusCode, String status, String message, Map<String, ?> errorDetails) {
        return new ApiResponse<>(statusCode, status, message, null, errorDetails);
    }

    public static <T> ApiResponse<T> badRequest(String message, Map<String, ?> errorDetails) {
        return error(400, "Bad Request", message, errorDetails);
    }

    public static <T> ApiResponse<T> notFound(String message) {
        return error(404, "Not Found", message, null);
    }

    public static <T> ApiResponse<T> conflict(String message) {
        return error(409, "Conflict", message, null);
    }

    public static <T> ApiResponse<T> internalServerError(String message) {
        return error(500, "Internal Server Error", message, null);
    }
}