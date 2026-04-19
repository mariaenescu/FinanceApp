package org.example.finance.models.responses

import java.math.BigDecimal

data class HistorySummaryDTO(
    val totalIncomes: BigDecimal,
    val totalExpenses: BigDecimal,
    val lastTransactions: List<TransactionDTO>
)
