package org.example.finance.repositories

import java.time.LocalDateTime
import org.example.finance.models.Expense
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ExpenseRepository : JpaRepository<Expense, String> {
    fun countByIbanSender(iban: String): Long
    fun findTop5ByIbanSenderOrderByDateDesc(iban: String): List<Expense>
    fun findByIbanSenderAndDateBetween(
            iban: String,
            start: LocalDateTime,
            end: LocalDateTime
    ): List<Expense>
    fun findByIbanSender(iban: String): List<Expense>
    fun findByIbanSenderOrderByDateDesc(iban: String): List<Expense>
}
