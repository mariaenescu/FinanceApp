package org.example.finance.models

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "incomes")
data class Income(
        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        val id: String? = null,
        @Column(nullable = false) val amount: BigDecimal,
        @Column(nullable = false) val description: String,
        @Column(nullable = false) val date: LocalDateTime = LocalDateTime.now(),
        @Column(name = "iban_sender", nullable = false) val ibanSender: String,
        @Column(name = "iban_receiver", nullable = false) val ibanReceiver: String
)
