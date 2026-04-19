package org.example.finance.controllers

import org.example.finance.models.Feedback
import org.example.finance.models.requests.FeedbackRequestDTO
import org.example.finance.services.FeedbackService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/feedback")
class FeedbackController(
    private val feedbackService: FeedbackService
) {
    @PostMapping
    fun submitFeedback(@RequestBody request: FeedbackRequestDTO): ResponseEntity<Feedback> {
        return ResponseEntity.ok(feedbackService.saveFeedback(request))
    }
}
