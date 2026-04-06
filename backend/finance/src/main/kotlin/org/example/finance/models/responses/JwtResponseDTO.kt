package org.example.finance.models.responses

// For sending back the JWT and user info
data class JwtResponseDTO (
    val accessToken: String,
    val email: String,
    val roles: List<String> // User or Admin
)