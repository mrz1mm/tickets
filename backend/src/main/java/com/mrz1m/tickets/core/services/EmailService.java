package com.mrz1m.tickets.core.services;

import java.util.Map;

public interface EmailService {
    void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> templateModel);
}