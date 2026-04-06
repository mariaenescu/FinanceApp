package org.example.finance.services

import org.example.finance.models.requests.UpdateSettingsReqDTO
import org.example.finance.models.responses.SettingsRespDTO
import org.example.finance.repositories.AccountRepository
import org.example.finance.repositories.CardRepository
import org.springframework.stereotype.Service
import java.math.BigDecimal

@Service
class SettingsService(
    private val accountRepository: AccountRepository,
    private val cardRepository: CardRepository,
    private val currentUser: CurrentUserService

) {

    fun getSettings(): SettingsRespDTO {
        val account = currentUser.getLoggedAccount()
        val card = account.card?.id?.let { cardRepository.findById(it).orElse(null) }
            ?: throw IllegalArgumentException("No card associated with this account!")

        val enabled = account.lowBalanceAlertEnabled ?: false
        val threshold = account.lowBalanceThreshold ?: BigDecimal("150.00")
        val hasPin = card.pinCode?.isNotBlank() == true

        return SettingsRespDTO(
            lowBalanceEnabled = enabled,
            lowBalanceThreshold = threshold,
            hasPinSet = hasPin
        )
    }

    fun updateSettings(dto: UpdateSettingsReqDTO): SettingsRespDTO {
        val account = currentUser.getLoggedAccount()

        val updatedAcc = account.copy(
            lowBalanceAlertEnabled = dto.lowBalanceEnabled ?: account.lowBalanceAlertEnabled,
            lowBalanceThreshold = dto.lowBalanceThreshold ?: account.lowBalanceThreshold
        )
        accountRepository.save(updatedAcc)

        if (dto.newPin != null) {
            require(Regex("""^\d{4}$""").matches(dto.newPin)) { "PIN must be exactly 4 digits!"}
            val card = account.card?.id?.let { cardRepository.findById(it).orElse(null) }
                ?: throw IllegalArgumentException("No card associated with this account!")
            val updatedCard = card.copy(pinCode = dto.newPin)
            cardRepository.save(updatedCard)
        }

        return getSettings()
    }
}