package org.example.finance.models.responses

import java.math.BigDecimal

data class LowBalanceAlertDTO(
    val shouldAlert: Boolean,
    val message: String? = null,
    val balance: BigDecimal? = null
)