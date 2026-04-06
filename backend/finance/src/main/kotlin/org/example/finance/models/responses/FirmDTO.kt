package org.example.finance.models.responses

import org.example.finance.enums.Category

data class FirmDTO(
    val fullName: String, // fullName
    val email: String,
    val category: Category,
    val iban: String
)
