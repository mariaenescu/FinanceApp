package org.example.finance.controllers

import org.example.finance.services.FirmService
import org.example.finance.enums.Category
import org.example.finance.models.requests.FirmListRequestDTO
import org.example.finance.models.requests.UpgradeFirmRequestDTO
import org.example.finance.models.responses.FirmDTO
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestParam

@RestController
@RequestMapping("/firms")
class FirmController(
    private val firmService: FirmService
) {
    @PostMapping("/upgrade")
    fun upgradeToFirm(
        @RequestBody req: UpgradeFirmRequestDTO
    ): ResponseEntity<Unit> {
        firmService.upgradeToFirm(req.category)
        return ResponseEntity.ok(Unit)
    }

    @PostMapping
    fun listFirms(
        @RequestBody req: FirmListRequestDTO
    ): ResponseEntity<List<FirmDTO>> {
        val firms = firmService.listFirms(req.category)
        return ResponseEntity.ok(firms)
    }
}