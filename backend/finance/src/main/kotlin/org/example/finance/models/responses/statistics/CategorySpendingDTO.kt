package org.example.finance.models.responses.statistics

import org.example.finance.enums.Category
import java.math.BigDecimal

data class CategorySpendingDTO(
    val category: Category,
    val total: BigDecimal
)