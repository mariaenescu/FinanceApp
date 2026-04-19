package org.example.finance.controllers

import org.example.finance.models.Expense
import org.example.finance.models.Income
import org.example.finance.models.requests.ExpenseRequestDTO
import org.example.finance.services.ExpenseService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/expense")
class ExpenseController (
    private val expenseService: ExpenseService
) {
    @PostMapping
    fun createExpense(@RequestBody expenseRequest: ExpenseRequestDTO): ResponseEntity<Pair<Expense, Income>> {
        return ResponseEntity.ok(expenseService.createExpense(expenseRequest))
    }
}
