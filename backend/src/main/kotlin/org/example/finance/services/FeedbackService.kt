package org.example.finance.services

import org.example.finance.models.Feedback
import org.example.finance.models.requests.FeedbackRequestDTO
import org.example.finance.repositories.FeedbackRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class FeedbackService(private val feedbackRepository: FeedbackRepository) {
    @Transactional
    fun saveFeedback(request: FeedbackRequestDTO): Feedback {
        val feedback =
                Feedback(
                        experience = request.experience,
                        recommend = request.recommend,
                        likedFeatures = request.likedFeatures.joinToString(","),
                        comments = request.comments
                )
        return feedbackRepository.save(feedback)
    }
}
