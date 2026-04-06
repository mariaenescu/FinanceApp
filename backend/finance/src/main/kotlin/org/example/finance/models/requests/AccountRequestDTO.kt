package org.example.finance.models.requests

import org.example.finance.enums.Category
import java.math.BigDecimal

data class AccountRequestDTO(
    val category: Category? = null,
    val initialBalance: BigDecimal? = null,
)