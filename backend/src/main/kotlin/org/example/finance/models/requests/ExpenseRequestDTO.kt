package org.example.finance.models.requests

import java.math.BigDecimal

data class ExpenseRequestDTO (
    val description: String,
    val amount: BigDecimal,
    val ibanReceiver: String,
    val pin: String? = null
)