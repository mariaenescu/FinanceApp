package org.example.finance.services

import org.example.finance.enums.Category
import org.example.finance.models.Account
import org.example.finance.models.Card
import org.example.finance.models.Income
import org.example.finance.repositories.AccountRepository
import org.example.finance.repositories.CardRepository
import org.example.finance.repositories.IncomeRepository
import org.example.finance.repositories.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.math.BigDecimal
import java.time.LocalDateTime
import kotlin.random.Random

//private val PIN_THRESHOLD: BigDecimal = BigDecimal("100")

@Service
class CardService(
    private val cardRepository: CardRepository,
    private val accountRepository: AccountRepository,
    private val incomeRepository: IncomeRepository,
    private val userRepository: UserRepository,
    private val currentUser: CurrentUserService
) {
    companion object {
        private val PIN_THRESHOLD = BigDecimal("100")
        private val PIN_REGEX = Regex("""^\d{4}$""")
    }

    fun getCardForAccount(account: Account) =
        account.card?.id?.let { cardRepository.findById(it).orElse(null) }

    fun generateNumber(n : Int): String {
        val builder = StringBuilder()
        repeat(n) {
            builder.append(Random.nextInt(0, 10))
        }
        return builder.toString()
    }

    fun createCard(): Card {
        val card = Card(
            cardNumber = generateNumber(16),
            cvvNumber = generateNumber(3),
            expirationDate = LocalDateTime.now().plusYears(5)
        )
        val savedCard = cardRepository.save(card)

        return savedCard
    }

    fun addMoney(amount: BigDecimal, description: String? = null) {
        if (amount <= BigDecimal.ZERO) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be positive!")
        }

        val account = currentUser.getLoggedAccount()

        val newBalance = account.balance.add(amount)
        accountRepository.save(account.copy(balance = newBalance))

        incomeRepository.save(
            Income(
                amount = amount,
                description = description ?: "Card loaded at ATM",
                date = LocalDateTime.now(),
                ibanSender = account.iban,
                ibanReceiver = account.iban
            )
        )
    }

    fun needsPinForFirm(amount: BigDecimal, firmIban: String): Boolean {
        val firmAccount = accountRepository.findByIban(firmIban)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Account with IBAN $firmIban not found!")

        return firmAccount.category != Category.USER && amount > PIN_THRESHOLD
    }

    fun verifyPaymentToFirm(amount: BigDecimal, firmIban: String, providedPin: String?): Boolean {
        if (!needsPinForFirm(amount, firmIban)) return true

        if (providedPin == null) {
            throw ResponseStatusException(HttpStatus.PRECONDITION_REQUIRED, "PIN is required for payments over $PIN_THRESHOLD to firm accounts!")
        }
        if (!PIN_REGEX.matches(providedPin)) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid PIN format!")
        }

        val myAccount = currentUser.getLoggedAccount()
        val card = getCardForAccount(myAccount)
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "No card associated with this account!")

        val currentPin = card.pinCode?.trim()
        if (currentPin.isNullOrBlank()) {
            // first payment => pin will be auto set
            val updated = card.copy(pinCode = providedPin)
            cardRepository.save(updated)
            return true
        }

        if (currentPin != providedPin) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid PIN. Please try again!")
        }

        return true
    }

    fun deleteCard() {
        val account = currentUser.getLoggedAccount()
        val cardId = account.card?.id
        if (cardId == null) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "No card associated with this account!")
        }
        cardRepository.deleteById(cardId)
    }
}