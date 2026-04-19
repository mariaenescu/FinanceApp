package org.example.finance.models.requests

import java.math.BigDecimal

data class UpdateSettingsReqDTO(
    val lowBalanceEnabled: Boolean? = null,
    val lowBalanceThreshold: BigDecimal? = null,
    val newPin: String? = null
)