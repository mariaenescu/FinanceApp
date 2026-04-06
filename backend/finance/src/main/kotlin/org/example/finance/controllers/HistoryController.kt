package org.example.finance.controllers

import org.example.finance.models.responses.HistorySummaryDTO
import org.example.finance.models.responses.TransactionDTO
import org.example.finance.services.HistoryService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/history")
class HistoryController(private val historyService: HistoryService) {

    @GetMapping
    fun getHistory(): ResponseEntity<HistorySummaryDTO> {
        return ResponseEntity.ok(historyService.fullTransactionHistory())
    }

    @GetMapping("/recent/users")
    fun getRecentUserTransactions(): ResponseEntity<List<TransactionDTO>> {
        val data = historyService.last4UserPeerTransactions()
        return ResponseEntity.ok(data)
    }

    @GetMapping("/recent/firms")
    fun getRecentFirmPayments(): ResponseEntity<List<TransactionDTO>> {
        val data = historyService.last4FirmPayments()
        return ResponseEntity.ok(data)
    }
}