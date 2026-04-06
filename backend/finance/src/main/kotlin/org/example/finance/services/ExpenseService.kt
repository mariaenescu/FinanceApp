package org.example.finance.services

import org.example.finance.enums.Category
import org.example.finance.models.Expense
import org.example.finance.models.Income
import org.example.finance.models.requests.ExpenseRequestDTO
import org.example.finance.repositories.AccountRepository
import org.example.finance.repositories.ExpenseRepository
import org.example.finance.repositories.IncomeRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.math.BigDecimal

@Service
class ExpenseService(
    private val expenseRepository: ExpenseRepository,
    private val incomeRepository: IncomeRepository,
    private val accountRepository: AccountRepository,
    private val friendService: FriendService,
    private val currentUser: CurrentUserService,
    private val cardService: CardService
) {
    @Transactional
    fun createExpense(expenseRequest: ExpenseRequestDTO): Pair<Expense, Income> {
        val me = currentUser.getLoggedAccount()

        if (expenseRequest.amount <= BigDecimal.ZERO) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be positive")
        }
        if (me.balance < expenseRequest.amount) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient funds")
        }

        val receiverAccount = accountRepository.findByIban(expenseRequest.ibanReceiver)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Account with IBAN $expenseRequest not found!")

        cardService.verifyPaymentToFirm(expenseRequest.amount, expenseRequest.ibanReceiver, expenseRequest.pin)
        val account = friendService.addFriendAfterTransaction(expenseRequest.ibanReceiver)

        accountRepository.save(account.copy(balance = account.balance - expenseRequest.amount))
        accountRepository.save(receiverAccount.copy(balance = receiverAccount.balance + expenseRequest.amount))

        return Pair(
            expenseRepository.save(
                Expense(
                    description = expenseRequest.description,
                    amount = expenseRequest.amount,
                    ibanReceiver = expenseRequest.ibanReceiver,
                    ibanSender = account.iban,
                    category = receiverAccount.category
                )
            ),
            incomeRepository.save(
                Income(
                    description = expenseRequest.description,
                    amount = expenseRequest.amount,
                    ibanReceiver = expenseRequest.ibanReceiver,
                    ibanSender = account.iban
                )
            )
        )
    }
}
