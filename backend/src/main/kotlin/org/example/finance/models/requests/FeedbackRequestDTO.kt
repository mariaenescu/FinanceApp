package org.example.finance.models.requests

data class FeedbackRequestDTO(
    val experience: String,
    val recommend: Boolean,
    val likedFeatures: List<String>,
    val comments: String?
)
