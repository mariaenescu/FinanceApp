package org.example.finance.services

import org.example.finance.models.Expense
import org.example.finance.models.Income
import org.example.finance.models.responses.statistics.CategorySpendingDTO
import org.example.finance.models.responses.statistics.DashboardStatsDTO
import org.example.finance.models.responses.statistics.SummaryDTO
import org.example.finance.models.responses.statistics.WeeklyBarDTO
import org.example.finance.repositories.ExpenseRepository
import org.example.finance.repositories.IncomeRepository
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalDateTime

@Service
class StatsService(
    private val expenseRepository: ExpenseRepository,
    private val incomeRepository: IncomeRepository,
    private val currentUser: CurrentUserService
) {
    fun dashboard(start: LocalDateTime, end: LocalDateTime): DashboardStatsDTO {
        val account = currentUser.getLoggedAccount()
        val iban = account.iban

        val month = periodSummary(iban, startEndOfCurrent("month"))
        val week = periodSummary(iban, start to end)
        return DashboardStatsDTO(month, week,weeklySpending(iban, start to end), spendingByCategory(iban))
    }

    fun startEndOfCurrent(period: String): Pair<LocalDateTime, LocalDateTime> {
        val today = LocalDate.now()
        return when (period) {
            "month" -> {
                val start = today.withDayOfMonth(1).atStartOfDay()
                val end = start.plusMonths(1)
                start to end
            }
            "week" -> {
                val start = today.with(DayOfWeek.MONDAY).atStartOfDay()
                val end = start.plusWeeks(1)
                start to end
            }
            else -> throw IllegalArgumentException()
        }
    }

    fun startEndWeekWithOffset(offset: Long): Pair<LocalDateTime, LocalDateTime> {
        val (start, end) = startEndOfCurrent("week")
        return start.plusWeeks(offset) to end.plusWeeks(offset)
    }

    private fun sumAmounts(list: List<Any>) =
        list.fold(BigDecimal.ZERO) { acc, e ->
            when (e) {
                is Income -> acc + e.amount
                is Expense -> acc + e.amount
                else -> acc
            }
        }

    fun spendingByCategory(iban: String): List<CategorySpendingDTO> {
        val expenses = expenseRepository.findByIbanSender(iban)
        return expenses
            .groupBy { it.category }
            .map { (category, list) -> CategorySpendingDTO(category,sumAmounts(list)) }
            .sortedByDescending { it.total }
    }

    fun weeklySpending(iban: String, range: Pair<LocalDateTime, LocalDateTime>): List<WeeklyBarDTO> {
        val (start, end) = range
        val weekExpenses = expenseRepository.findByIbanSenderAndDateBetween(iban, start, end)
        val byDay = weekExpenses
            .groupBy { it.date.dayOfWeek }
            .mapValues { (_, list) -> list.sumOf { it.amount } }
        val order = listOf(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY)
        return order
            .map { day -> WeeklyBarDTO(day.name, byDay[day] ?: BigDecimal.ZERO)}
    }

    private fun periodSummary(iban: String, range: Pair<LocalDateTime, LocalDateTime>): SummaryDTO {
        val (start, end) = range
        val expenses = sumAmounts(expenseRepository.findByIbanSenderAndDateBetween(iban, start, end))
        val incomes = sumAmounts(incomeRepository.findByIbanReceiverAndDateBetween(iban, start, end))
        val netSavings = incomes - expenses
        return SummaryDTO(incomes, expenses, netSavings)
    }
}