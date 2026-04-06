package org.example.finance.mappers

import org.example.finance.models.Card
import org.example.finance.models.responses.CardResponseDTO
import java.time.YearMonth

object CardMapper {
    private fun mask(number: String) =
        "**** **** **** ${number.takeLast(4)}"

    fun toResponseDTO(card: Card) =
        CardResponseDTO(
            id = requireNotNull(card.id),
            cardNumberMasked = mask(card.cardNumber),
            cardNumber = card.cardNumber,
            expirationDate = YearMonth.from(card.expirationDate),
            cvvNumber = card.cvvNumber
        )
}