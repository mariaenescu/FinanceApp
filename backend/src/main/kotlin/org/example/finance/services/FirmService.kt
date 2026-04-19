package org.example.finance.services

import org.example.finance.enums.Category
import org.example.finance.models.responses.FirmDTO
import org.example.finance.repositories.AccountRepository
import org.example.finance.repositories.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class FirmService(
        private val accountRepository: AccountRepository,
        private val userRepository: UserRepository,
        private val currentUser: CurrentUserService
) {
    fun upgradeToFirm(category: Category) {
        if (category == Category.USER) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid firm category")
        }

        val account = currentUser.getLoggedAccount()
        if (account.category != Category.USER) {
            throw ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Account is already a firm (${account.category})"
            )
        }

        val updated = account.copy(category = category)
        accountRepository.save(updated)
    }

    fun listFirms(category: Category?): List<FirmDTO> {
        val accounts =
                when {
                    category == null || category == Category.USER -> {
                        accountRepository.findByCategoryIsNot(Category.USER)
                    }
                    else -> accountRepository.findByCategory(category)
                }

        if (accounts.isEmpty()) return emptyList()

        val accountIds = accounts.mapNotNull { it.id }
        val usersByAccountId =
                userRepository.findByAccount_IdIn(accountIds).associateBy { it.account?.id }

        return accounts.mapNotNull { acc ->
            val owner = usersByAccountId[acc.id] ?: return@mapNotNull null
            FirmDTO(
                    fullName = owner.fullName,
                    email = owner.email,
                    category = acc.category,
                    iban = acc.iban
            )
        }
    }
}
