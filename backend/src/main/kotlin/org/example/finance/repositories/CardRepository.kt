package org.example.finance.repositories

import java.util.Optional
import org.example.finance.models.Card
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CardRepository : JpaRepository<Card, String> {
    override fun findById(cardId: String): Optional<Card>
}
