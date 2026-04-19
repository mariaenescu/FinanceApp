package org.example.finance.repositories

import java.util.Optional
import org.example.finance.models.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : JpaRepository<User, String> {
    fun existsByEmail(email: String): Boolean
    fun findByEmail(email: String): Optional<User>
    fun findByAccount_Id(accountId: String?): User?
    fun findByAccount_IdIn(accountIds: List<String>): List<User>
}
