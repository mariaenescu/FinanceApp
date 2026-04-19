package org.example.finance.services

import org.example.finance.enums.Category
import org.example.finance.models.Account
import org.example.finance.models.responses.FriendResponseDTO
import org.example.finance.repositories.AccountRepository
import org.example.finance.repositories.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class FriendService(
    private val userRepository: UserRepository,
    private val accountRepository: AccountRepository,
    private val currentUser: CurrentUserService

) {
    fun addFriendAfterTransaction(iban: String): Account {
        val me = currentUser.getLoggedAccount()
        val friendAccount = accountRepository.findByIban(iban) ?: return me

        if (friendAccount.id == me.id || friendAccount.category != Category.USER) return me

        val friendId = requireNotNull(friendAccount.id) { "Friend account must have an ID" }
        if (me.friends.contains(friendId)) return me

        val updatedAcc = me.copy(friends = me.friends + friendId)
        accountRepository.save(updatedAcc)
        return updatedAcc
    }

    fun addFriendByIban(iban: String): FriendResponseDTO {
        val me = currentUser.getLoggedAccount()

        val friendAccount = accountRepository.findByIban(iban)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Account with IBAN $iban not found")

        if (friendAccount.id == me.id) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot add yourself")
        }

        if (friendAccount.category != Category.USER) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Only USER accounts can be added as friends")
        }

        val friendId = requireNotNull(friendAccount.id) { "Friend account must have an ID" }

        if (me.friends.contains(friendId)) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "This account is already your friend")
        }

        val updatedAcc = me.copy(friends = me.friends + friendId)
        accountRepository.save(updatedAcc)

        val owner = userRepository.findByAccount_IdIn(listOf(friendId)).firstOrNull()
            ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Owner of friend account not found")

        return FriendResponseDTO(
            fullName = owner.fullName,
            email = owner.email,
            iban = friendAccount.iban
        )
    }

    fun listFriends(): List<FriendResponseDTO> {
        val me = currentUser.getLoggedAccount()
        val ids = me.friends
        if (ids.isEmpty()) return emptyList()

        val accountsById = accountRepository.findAllById(ids).associateBy{ requireNotNull(it.id) }
        val ownersByAccountId = userRepository.findByAccount_IdIn(ids).associateBy { it.account?.id }

        return ids.mapNotNull { id ->
            val acc = accountsById[id] ?: return@mapNotNull null
            val owner = ownersByAccountId[id] ?: return@mapNotNull null

            FriendResponseDTO(
                fullName = owner.fullName,
                email = owner.email,
                iban = acc.iban
            )
        }
    }

    fun searchFriends(query: String): List<FriendResponseDTO> {
        val q = query.trim().lowercase()
        if (q.isEmpty()) return listFriends()
        return listFriends().filter {
            val nameMatch = it.fullName.lowercase().contains(q)
            val emailUser = it.email.substringBefore("@").lowercase()
            val emailMatch = emailUser.contains(q)
            nameMatch || emailMatch
        }
    }
}