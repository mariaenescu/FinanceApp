package org.example.finance.services

import java.time.LocalDateTime
import org.example.finance.models.responses.LowBalanceAlertDTO
import org.example.finance.repositories.AccountRepository
import org.springframework.stereotype.Service

@Service
class AlertService(
        private val accountRepository: AccountRepository,
        private val currentUser: CurrentUserService
) {

    fun checkLowBalance(): LowBalanceAlertDTO {
        val account = currentUser.getLoggedAccount()

        if (!account.lowBalanceAlertEnabled) {
            return LowBalanceAlertDTO(shouldAlert = false)
        }

        val balance = account.balance
        val threshold = account.lowBalanceThreshold

        if (balance < threshold) {
            val message = buildString {
                append("Your balance dropped below ")
                append(threshold.stripTrailingZeros().toPlainString())
                append(" RON. Current balance: ")
                append(balance.stripTrailingZeros().toPlainString())
                append(" RON.")
            }

            val now = LocalDateTime.now()
            val lastAlert = account.lastLowBalanceAlertAt
            if (lastAlert == null || lastAlert.isBefore(now.minusMinutes(5))) {
                accountRepository.save(account.copy(lastLowBalanceAlertAt = now))
            }

            return LowBalanceAlertDTO(shouldAlert = true, message = message, balance = balance)
        }

        return LowBalanceAlertDTO(shouldAlert = false)
    }
}
