package org.example.finance.models.responses.statistics

import java.math.BigDecimal

data class SummaryDTO(
    val incomes: BigDecimal,
    val expense: BigDecimal,
    val netSavings: BigDecimal
)
