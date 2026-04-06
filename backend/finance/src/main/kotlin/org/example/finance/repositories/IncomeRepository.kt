package org.example.finance.repositories

import java.time.LocalDateTime
import org.example.finance.models.Income
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface IncomeRepository : JpaRepository<Income, String> {
    fun countByIbanReceiver(iban: String): Long
    fun findTop5ByIbanReceiverOrderByDateDesc(iban: String): List<Income>
    fun findByIbanReceiverAndDateBetween(
            iban: String,
            start: LocalDateTime,
            end: LocalDateTime
    ): List<Income>
    fun findByIbanReceiverOrderByDateDesc(iban: String): List<Income>
}
