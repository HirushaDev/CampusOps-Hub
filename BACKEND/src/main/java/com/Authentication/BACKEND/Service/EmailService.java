package com.Authentication.BACKEND.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    public void sendWelcomeEmail(String toEmail, String name) {
        // Create a new email message
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to CampusOps Hub, " + name + "!");

        // Build the email text
        String text = "Dear " + name + ",\n\n" +
                "Welcome to CampusOps Hub!\n\n" +
                "We’re excited to have you onboard. CampusOps Hub is designed to simplify and streamline campus operations, making it easier for you to manage facility bookings, report incidents, and stay updated with maintenance activities—all in one place.\n\n" +
                "With CampusOps Hub, you can:\n" +
                "- Book rooms, labs, and equipment\n" +
                "- Report issues and track their progress\n" +
                "- Receive real-time updates from technicians\n" +
                "- Manage your tasks efficiently through a centralized system\n\n" +
                "Our goal is to provide you with a smooth, transparent, and reliable experience. If you have any questions or need assistance, feel free to reach out to our support team at any time.\n\n" +
                "Thank you for choosing CampusOps Hub!\n\n" +
                "Best regards,\n" +
                "CampusOps Hub Team";

        message.setText(text);

        // Send the email
        mailSender.send(message);
    }
}
