package org.example.finance.controllers

import org.example.finance.models.Account
import org.example.finance.models.requests.AccountRequestDTO
import org.example.finance.repositories.AccountRepository
import org.example.finance.services.AccountService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/accounts")
class AccountController(
    private val accountRepository: AccountRepository,
    private val accountService: AccountService
) {

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun getAllAccounts(): List<Account> = accountRepository.findAll()

    @GetMapping("/{id}")
    fun getAccountById(@PathVariable id: String): ResponseEntity<Account> {
        return accountRepository.findById(id)
            .map { ResponseEntity.ok(it) }
            .orElse(ResponseEntity.notFound().build())
    }

    @PostMapping
    fun createAccount(@RequestBody req: AccountRequestDTO): ResponseEntity<Account> {
        return ResponseEntity.status(HttpStatus.CREATED).body(accountService.createAccount(req))
    }

    @PutMapping("/{id}")
    fun updateAccount(@PathVariable id: String, @RequestBody req: AccountRequestDTO): ResponseEntity<Account> {
        return accountRepository.findById(id).map { existing ->
            val updated = existing.copy(
                category = req.category ?: existing.category,
                balance = req.initialBalance ?: existing.balance
            )
            ResponseEntity.ok(accountRepository.save(updated))
        }.orElse(ResponseEntity.notFound().build())
    }

    @DeleteMapping("/{id}")
    fun deleteAccount(@PathVariable id: String): ResponseEntity<Unit> {
        return if (accountRepository.existsById(id)) {
            accountRepository.deleteById(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
