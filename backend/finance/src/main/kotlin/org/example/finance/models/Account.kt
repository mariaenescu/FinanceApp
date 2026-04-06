package org.example.finance.models

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import org.example.finance.enums.Category

@Entity
@Table(name = "accounts")
data class Account(
        @Id @GeneratedValue(strategy = GenerationType.UUID) val id: String? = null,
        @OneToOne(cascade = [CascadeType.ALL])
        @JoinColumn(name = "card_id", referencedColumnName = "id")
        val card: Card? = null,
        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        val category: Category = Category.USER,
        @Column(unique = true, nullable = false) val iban: String,
        @Column(nullable = false) var balance: BigDecimal,
        @ElementCollection(fetch = FetchType.EAGER)
        @CollectionTable(name = "account_friends", joinColumns = [JoinColumn(name = "account_id")])
        @Column(name = "friend")
        val friends: List<String> = emptyList(),
        @Column(name = "low_balance_alert_enabled", nullable = false)
        val lowBalanceAlertEnabled: Boolean = true,
        @Column(name = "low_balance_threshold", nullable = false)
        val lowBalanceThreshold: BigDecimal = BigDecimal("150"),
        @Column(name = "last_low_balance_alert_at") val lastLowBalanceAlertAt: LocalDateTime? = null
)
