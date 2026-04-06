package org.example.finance.models.responses

import lombok.NoArgsConstructor

// For sending back the JWT and user info
@NoArgsConstructor
data class JwtResponse (
    val token: String
)