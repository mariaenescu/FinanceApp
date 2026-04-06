package org.example.finance.models.requests

data class UserRequestDTO (
    val fullName: String,
    val email: String,
    val password: String
)