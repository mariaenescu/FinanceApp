package org.example.finance.mappers

import org.example.finance.enums.Role
import org.example.finance.models.Account
import org.example.finance.models.Card
import org.example.finance.models.User
import org.example.finance.models.requests.UserRequestDTO
import org.example.finance.models.responses.HistorySummaryDTO
import org.example.finance.models.responses.UserResponseDTO
import org.example.finance.mappers.AccountMapper

object UserMapper {
    fun toEntity(dto: UserRequestDTO, password: String): User =
        User(
            id = null,
            email = dto.email,
            password = password,
            role = Role.USER,
            account = null,
            fullName = dto.fullName
        )

    fun toResponseDTO(user: User, account: Account? = null, card: Card?, history: HistorySummaryDTO? = null): UserResponseDTO =
        UserResponseDTO(
            fullName = user.fullName,
            email = user.email,
            account = account?.let { AccountMapper.toResponseDTO(it, card, history) }
        )
}