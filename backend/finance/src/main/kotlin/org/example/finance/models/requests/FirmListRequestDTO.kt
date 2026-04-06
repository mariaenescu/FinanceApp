package org.example.finance.models.requests

import org.example.finance.enums.Category

data class FirmListRequestDTO(
    val category: Category? = null
)