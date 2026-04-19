package org.example.finance.models.responses.statistics

import java.math.BigDecimal

data class WeeklyBarDTO(
    val day: String,
    val total: BigDecimal
)
