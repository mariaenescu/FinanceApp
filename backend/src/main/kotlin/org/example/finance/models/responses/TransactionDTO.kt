package org.example.finance.models.responses

import org.example.finance.enums.TransactionType
import java.math.BigDecimal
import java.time.LocalDateTime

// The response for transactions is on a unified DTO(Income + Expense)
data class TransactionDTO(
    val type: TransactionType,
    val amount: BigDecimal,
    val description: String? = null,
    val ibanSender: String? = null,
    val ibanReceiver: String? = null,
    val date: LocalDateTime,
    val fromOrTo: String // account username
)
