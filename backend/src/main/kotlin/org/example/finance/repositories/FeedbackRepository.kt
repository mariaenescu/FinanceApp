package org.example.finance.repositories

import org.example.finance.models.Feedback
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository interface FeedbackRepository : JpaRepository<Feedback, String>
