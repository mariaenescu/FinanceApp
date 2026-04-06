package org.example.finance.services

import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class EmailService(private val mailSender: JavaMailSender) {

    fun sendEmail(to: String, subject: String, text: String) {
        val message = SimpleMailMessage()
        message.from = "noreply@finance-app.com"
        message.setTo(to)
        message.subject = subject
        message.text = text
        mailSender.send(message)
    }

    fun sendNotification(email: String, messageTitle: String, messageBody: String) {
        try {
            sendEmail(email, messageTitle, messageBody)
        } catch (e: Exception) {
            println("Failed to send email to $email: ${e.message}")
        }
    }
}
