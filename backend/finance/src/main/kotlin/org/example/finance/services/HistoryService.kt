package org.example.finance.services

import org.example.finance.enums.Category
import org.example.finance.mappers.TransactionMapper
import org.example.finance.models.responses.HistorySummaryDTO
import org.example.finance.models.responses.TransactionDTO
import org.example.finance.repositories.AccountRepository
import org.example.finance.repositories.ExpenseRepository
import org.example.finance.repositories.IncomeRepository
import org.example.finance.repositories.UserRepository
import org.springframework.stereotype.Service

@Service
class HistoryService(
    private val incomeRepository: IncomeRepository,
    private val expenseRepository: ExpenseRepository,
    private val accountRepository: AccountRepository,
    private val userRepository: UserRepository,
    private val currentUserService: CurrentUserService
) {
    fun fullTransactionHistory(): HistorySummaryDTO? {
        val account = currentUserService.getLoggedAccount()
        val iban = account.iban
        val totalIncome = incomeRepository.countByIbanReceiver(iban)
        val totalExpense = expenseRepository.countByIbanSender(iban)

        val lastIncome = incomeRepository.findByIbanReceiverOrderByDateDesc(iban).map {
            TransactionMapper.fromIncome(it,
                senderName = userRepository.findByAccount_Id((accountRepository.findByIban(it.ibanSender))?.id)?.fullName ?: "Unknown")
        }
        val lastExpense = expenseRepository.findByIbanSenderOrderByDateDesc(iban).map {
            TransactionMapper.fromExpense(it,
                receiverName = userRepository.findByAccount_Id((accountRepository.findByIban(it.ibanReceiver))?.id)?.fullName ?: "Unknown")
        }
        val lastTransactions = (lastIncome + lastExpense).sortedByDescending { it.date }
        return HistorySummaryDTO(totalIncome.toBigDecimal(), totalExpense.toBigDecimal(), lastTransactions)
    }

    fun last4UserPeerTransactions(): List<TransactionDTO> {
        val me = currentUserService.getLoggedAccount()
        val myIban = me.iban

        val incomesFromUsers = incomeRepository.findByIbanReceiverOrderByDateDesc(myIban)
            .mapNotNull { inc ->
                val senderAcc = accountRepository.findByIban(inc.ibanSender) ?: return@mapNotNull null
                // only if sender is USER
                if (senderAcc.category != Category.USER) return@mapNotNull null
                if (inc.ibanReceiver == inc.ibanSender) return@mapNotNull null
                val senderName = userRepository.findByAccount_Id(senderAcc.id)?.fullName ?: "Unknown"
                TransactionMapper.fromIncome(inc, senderName = senderName)
            }

        val expensesToUsers = expenseRepository.findByIbanSenderOrderByDateDesc(myIban)
            .mapNotNull { exp ->
                val receiverAcc = accountRepository.findByIban(exp.ibanReceiver) ?: return@mapNotNull null
                // only if receiver is USER
                if (receiverAcc.category != Category.USER) return@mapNotNull null
                val receiverName = userRepository.findByAccount_Id(receiverAcc.id)?.fullName ?: "Unknown"
                TransactionMapper.fromExpense(exp, receiverName = receiverName)
            }

        return (incomesFromUsers + expensesToUsers).sortedByDescending { it.date }.take(4)
    }

    fun last4FirmPayments(): List<TransactionDTO> {
        val me = currentUserService.getLoggedAccount()
        val myIban = me.iban

        val expensesToFirms = expenseRepository.findByIbanSenderOrderByDateDesc(myIban)
            .mapNotNull { exp ->
                val receiverAcc = accountRepository.findByIban(exp.ibanReceiver) ?: return@mapNotNull null
                if (receiverAcc.category == Category.USER) return@mapNotNull null
                val receiverName = userRepository.findByAccount_Id(receiverAcc.id)?.fullName ?: "Unknown"
                TransactionMapper.fromExpense(exp, receiverName = receiverName)
            }

        return expensesToFirms.sortedByDescending { it.date }.take(4)
    }
}