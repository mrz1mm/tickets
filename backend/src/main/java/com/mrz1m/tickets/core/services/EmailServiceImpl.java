package com.mrz1m.tickets.core.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Override
    @Async
    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> templateModel) {
        try {
            // Prepara il contesto di Thymeleaf con le variabili
            Context context = new Context();
            context.setVariables(templateModel);

            // Crea il contenuto specifico (es. invitation.html)
            String contentHtml = templateEngine.process("email/" + templateName, context);

            // Inserisce il contenuto specifico nel layout master
            context.setVariable("template", contentHtml);
            String finalHtml = templateEngine.process("email/master-layout", context);

            // Crea e invia l'email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(finalHtml, true);

            mailSender.send(message);
            log.info("Email inviata con successo a {}", to);

        } catch (MessagingException e) {
            log.error("Errore durante l'invio dell'email a {}", to, e);
        }
    }
}