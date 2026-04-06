package org.example.finance.models

data class History (
    val incomes: MutableList<Income>? = null,
    val expenses: MutableList<Expense>? = null
)
