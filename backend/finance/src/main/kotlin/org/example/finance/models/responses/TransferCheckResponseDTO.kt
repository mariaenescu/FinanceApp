package org.example.finance.models.responses

class TransferCheckResponseDTO (
    val requiresPin: Boolean,
    val message: String? = null
)