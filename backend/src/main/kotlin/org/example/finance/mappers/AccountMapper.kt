package org.example.finance.mappers

import org.example.finance.enums.Category
import org.example.finance.mappers.CardMapper
import org.example.finance.models.Account
import org.example.finance.models.Card
import org.example.finance.models.requests.AccountRequestDTO
import org.example.finance.models.responses.AccountResponseDTO
import org.example.finance.models.responses.HistorySummaryDTO
import java.math.BigDecimal

object AccountMapper {
    fun toEntity(dto: AccountRequestDTO, iban: String): Account =
        Account(
            id = null,
            card = null,
            category = dto.category ?: Category.USER,
            iban = iban,
            balance = dto.initialBalance ?: BigDecimal.ZERO,
            friends = emptyList())

    fun toResponseDTO(account: Account?, card: Card?, history: HistorySummaryDTO? = null): AccountResponseDTO =
        AccountResponseDTO(
            card = card?.let { CardMapper.toResponseDTO(it) },
            history = history,
            category = account!!.category,
            iban = account.iban,
            balance = account.balance
        )
}