package org.example.finance.models.responses

import org.example.finance.enums.Category
import java.math.BigDecimal

data class AccountResponseDTO(
    val card: CardResponseDTO? = null,
    val history: HistorySummaryDTO? = null,
    val category: Category,
    val iban: String,
    val balance: BigDecimal
)
