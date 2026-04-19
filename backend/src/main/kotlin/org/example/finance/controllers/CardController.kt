package org.example.finance.controllers

import org.example.finance.models.requests.TopupRequestDTO
import org.example.finance.services.CardService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/card")
class CardController(private val cardService: CardService) {

    @DeleteMapping
    fun deleteCard(): ResponseEntity<Unit?> {
        return ResponseEntity.ok(cardService.deleteCard())
    }

    @PostMapping("/topup")
    fun topup(@RequestBody req: TopupRequestDTO): ResponseEntity<Unit> {
        cardService.addMoney(req.amount, req.description)
        return ResponseEntity.ok(Unit)
    }
}
