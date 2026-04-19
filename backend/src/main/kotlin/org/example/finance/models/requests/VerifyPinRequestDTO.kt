package org.example.finance.models.requests

import java.math.BigDecimal

class VerifyPinRequestDTO (
    val amount: BigDecimal,
    val recipientEmail: String,
    val pin: String? = null
)