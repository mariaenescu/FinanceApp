package org.example.finance.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import java.time.ZonedDateTime
import java.util.Date
import javax.crypto.SecretKey
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component

@Component
class JwtProvider {

    @Value("\${jwt.secret}") private lateinit var secret: String

    @Value("\${jwt.ttlInMinutes}") private var ttlInMinutes = 60

    private fun extractAllClaims(token: String): Claims {
        return Jwts.parserBuilder().setSigningKey(secretKey()).build().parseClaimsJws(token).body
    }

    private fun secretKey(): SecretKey {
        val keyBytes = Decoders.BASE64.decode(secret)
        return Keys.hmacShaKeyFor(keyBytes)
    }

    fun extractUsername(token: String): String? {
        return extractAllClaims(token).subject
    }

    fun generateJwt(userDetails: UserDetails): String {
        val expirationDate =
                Date.from(ZonedDateTime.now().plusMinutes(ttlInMinutes.toLong()).toInstant())
        val roles = userDetails.authorities.map(GrantedAuthority::getAuthority).toSet()

        return Jwts.builder()
                .setSubject(userDetails.username)
                .claim("roles", roles)
                .setIssuedAt(Date(System.currentTimeMillis()))
                .setExpiration(expirationDate)
                .signWith(secretKey())
                .compact()
    }
}
