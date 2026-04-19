package org.example.finance.models.requests

import java.math.BigDecimal

data class TopupRequestDTO(
    val amount: BigDecimal,
    val description: String? = null
)