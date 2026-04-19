package org.example.finance.models

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "cards")
data class Card(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String? = null,

    @Column(name = "expiration_date", nullable = false)
    val expirationDate: LocalDateTime,

    @Column(name = "card_number", nullable = false)
    val cardNumber: String,

    @Column(name = "cvv_number", nullable = false)
    val cvvNumber: String,

    @Column(name = "pin_code")
    val pinCode: String? = null
)
