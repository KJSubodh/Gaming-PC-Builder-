package com.pcstore.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    public void sendPasswordResetEmail(String to, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Request - PC Store");
        message.setText("Click the link below to reset your password:\n\n" +
                "http://localhost:5173/reset-password?token=" + resetToken + "\n\n" +
                "This link will expire in 1 hour.\n\n" +
                "If you didn't request this, please ignore this email.");
        mailSender.send(message);
    }
    
    public void sendOrderConfirmation(String to, String orderNumber, double total) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Order Confirmation - PC Store");
        message.setText("Thank you for your order!\n\n" +
                "Order Number: " + orderNumber + "\n" +
                "Total Amount: ₹" + total + "\n\n" +
                "We will notify you once your order is shipped.");
        mailSender.send(message);
    }
}