package org.example.finance.models.responses

import java.time.YearMonth

data class CardResponseDTO(
    val id: String,
    val cardNumberMasked: String,
    val cardNumber: String,
    val expirationDate: YearMonth,
    val cvvNumber: String,
)