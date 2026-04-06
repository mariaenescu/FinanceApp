package org.example.finance.controllers

import org.example.finance.models.requests.UpdateSettingsReqDTO
import org.example.finance.models.responses.SettingsRespDTO
import org.example.finance.services.SettingsService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/settings")
class SettingsController(
    private val settingsService: SettingsService,
) {
    @GetMapping
    fun getSettings(): ResponseEntity<SettingsRespDTO> {
        return ResponseEntity.ok(settingsService.getSettings())
    }

    @PutMapping
    fun updateSettings(@RequestBody dto: UpdateSettingsReqDTO): ResponseEntity<SettingsRespDTO> {
        return ResponseEntity.ok(settingsService.updateSettings(dto))
    }
}