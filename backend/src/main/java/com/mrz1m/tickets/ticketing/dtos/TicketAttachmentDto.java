package com.mrz1m.tickets.ticketing.dtos;

import com.mrz1m.tickets.auth.dtos.UserDto;
import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class TicketAttachmentDto {
    private Long id;
    private String fileName;
    private String mimeType;
    private Long fileSizeBytes;
    private UserDto uploader;
    private OffsetDateTime createdAt;
    private String downloadUrl; // Generato dinamicamente dal backend
}