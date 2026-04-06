package org.example.finance.models.requests

// For receiving login requests
data class LoginRequestDTO (
    val email: String,
    val password: String
)