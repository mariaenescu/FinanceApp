package org.example.finance.controllers

import org.example.finance.models.responses.statistics.DashboardStatsDTO
import org.example.finance.services.StatsService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/stats")
class StatsController(
    private val statsService: StatsService
) {
    @RequestMapping()
    @GetMapping
    fun getDashboardStats(@RequestParam(required = false, defaultValue = "0") offset: Int): ResponseEntity<DashboardStatsDTO> {
        val (start, end) = statsService.startEndWeekWithOffset(offset.toLong())
        return ResponseEntity.ok(statsService.dashboard(start, end))
    }
}