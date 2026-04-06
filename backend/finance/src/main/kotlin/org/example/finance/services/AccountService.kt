package org.example.finance.services

import org.example.finance.mappers.AccountMapper
import org.example.finance.mappers.TransactionMapper
import org.example.finance.models.Account
import org.example.finance.models.requests.AccountRequestDTO
import org.example.finance.models.responses.HistorySummaryDTO
import org.example.finance.repositories.AccountRepository
import org.example.finance.repositories.ExpenseRepository
import org.example.finance.repositories.IncomeRepository
import org.example.finance.repositories.UserRepository
import lombok.AllArgsConstructor
import lombok.NoArgsConstructor
import org.springframework.stereotype.Service
import java.math.BigDecimal

@Service
class AccountService(
    private val accountRepository: AccountRepository,
    private val incomeRepository: IncomeRepository,
    private val expenseRepository: ExpenseRepository,
    private val userRepository: UserRepository
) {
    fun createAccount(accountRequest: AccountRequestDTO): Account {
        val iban = generateIban()
        val entity = AccountMapper.toEntity(accountRequest, iban)
        val createdAccount = accountRepository.save(entity)
        return createdAccount
    }

    fun getHistorySummary(iban: String): HistorySummaryDTO? {
        val totalIncome = incomeRepository.countByIbanReceiver(iban)
        val totalExpense = expenseRepository.countByIbanSender(iban)
        val lastIncome = incomeRepository.findTop5ByIbanReceiverOrderByDateDesc(iban).map {
            TransactionMapper.fromIncome(it, senderName = userRepository.findByAccount_Id((accountRepository.findByIban(it.ibanSender))?.id)?.fullName ?: "Unknown")}
        val lastExpense = expenseRepository.findTop5ByIbanSenderOrderByDateDesc(iban).map { TransactionMapper.fromExpense(it,
            receiverName = userRepository.findByAccount_Id((accountRepository.findByIban(it.ibanReceiver))?.id)?.fullName ?: "Unknown") }

        val lastTransactions = (lastIncome + lastExpense).sortedByDescending { it.date }.take(5)
        return HistorySummaryDTO(BigDecimal.valueOf(totalIncome), BigDecimal.valueOf(totalExpense), lastTransactions)
    }

    fun generateIban(): String {
        var iban: String
        do {
            iban = "RO" + (1000000000000000..9999999999999999).random().toString()
        } while (accountRepository.existsByIban(iban))
        return iban
    }
}
