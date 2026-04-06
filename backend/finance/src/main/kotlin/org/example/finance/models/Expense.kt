package org.example.finance.models

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import org.example.finance.enums.Category

@Entity
@Table(name = "expenses")
data class Expense(
        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        val id: String? = null,
        @Column(nullable = false) var description: String,
        @Column(nullable = false) var amount: BigDecimal,
        @Column(nullable = false) var date: LocalDateTime = LocalDateTime.now(),
        @Column(name = "iban_receiver", nullable = false) var ibanReceiver: String,
        @Column(name = "iban_sender", nullable = false) var ibanSender: String,
        @Enumerated(EnumType.STRING) @Column(nullable = false) val category: Category
)
