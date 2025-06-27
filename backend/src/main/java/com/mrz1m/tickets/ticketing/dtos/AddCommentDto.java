package com.mrz1m.tickets.ticketing.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddCommentDto {
    @NotBlank(message = "Il contenuto del commento non può essere vuoto")
    private String content;
}