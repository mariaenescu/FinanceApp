package org.example.finance.repositories

import java.util.Optional
import org.example.finance.enums.Category
import org.example.finance.models.Account
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AccountRepository : JpaRepository<Account, String> {
    fun existsByIban(iban: String): Boolean
    override fun findById(accountId: String): Optional<Account>
    fun findByCategory(category: Category): List<Account>
    fun findByCategoryIsNot(category: Category): List<Account>
    fun findByIban(iban: String): Account?
}
