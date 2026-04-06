package org.example.finance.models.requests

import org.example.finance.enums.Category

data class UpgradeFirmRequestDTO(
    val category: Category
)