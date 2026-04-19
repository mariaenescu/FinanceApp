package org.example.finance.security

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import java.io.IOException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import org.springframework.web.servlet.HandlerExceptionResolver

@Component
class JwtAuthorizationFilter(
        private val jwtProvider: JwtProvider,
        private val userDetailsService: UserDetailsService,
        private val handlerExceptionResolver: HandlerExceptionResolver,
        private val tokenBlocklistService: TokenBlocklistService
) : OncePerRequestFilter() {

    @Throws(ServletException::class, IOException::class)
    override fun doFilterInternal(
            request: HttpServletRequest,
            response: HttpServletResponse,
            filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
            return
        }

        try {
            val jwt = authHeader.substring(7)

            if (tokenBlocklistService.isBlocked(jwt)) {
                response.status = HttpServletResponse.SC_UNAUTHORIZED
                response.writer.write("Unauthorized")
                return
            }

            val username = jwtProvider.extractUsername(jwt)

            if (username != null) {
                val userDetails = userDetailsService.loadUserByUsername(username)
                val authToken =
                        UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.authorities
                        )
                SecurityContextHolder.getContext().authentication = authToken
            }
        } catch (ex: Exception) {
            handlerExceptionResolver.resolveException(request, response, null, ex)
            response.status = HttpServletResponse.SC_UNAUTHORIZED
            return
        }
        filterChain.doFilter(request, response)
    }
}
