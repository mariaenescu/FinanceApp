package org.example.finance.services

import org.example.finance.models.Account
import org.example.finance.models.User
import org.example.finance.repositories.AccountRepository
import org.springframework.http.HttpStatus
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class CurrentUserService(
    private val accountRepository: AccountRepository
) {
    fun getLoggedAccount(): Account {
        val user = SecurityContextHolder.getContext().authentication.principal as User
        val account = accountRepository.findById(user.account?.id ?: "")
            .orElseThrow { ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not logged in") }

        return account
    }
}