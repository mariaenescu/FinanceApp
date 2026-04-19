package org.example.finance.models

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "feedback")
data class Feedback(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String? = null,

    @Column(nullable = false)
    var experience: String,

    @Column(nullable = false)
    var recommend: Boolean,

    @Column(name = "liked_features")
    var likedFeatures: String? = null,

    @Column(columnDefinition = "TEXT")
    var comments: String? = null,

    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now()
)
