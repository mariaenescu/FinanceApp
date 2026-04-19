package org.example.finance.models

import jakarta.persistence.*
import org.example.finance.enums.Role
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

@Entity
@Table(name = "users")
data class User(
        @Id @GeneratedValue(strategy = GenerationType.UUID) val id: String? = null,
        @Column(unique = true, nullable = false) val email: String,
        @Column(nullable = false) private val password: String,
        @OneToOne(cascade = [CascadeType.ALL])
        @JoinColumn(name = "account_id", referencedColumnName = "id")
        var account: Account? = null,
        @Column(name = "full_name", nullable = false) val fullName: String,
        @Enumerated(EnumType.STRING) @Column(nullable = false) val role: Role = Role.USER
) : UserDetails {

        override fun getAuthorities(): Collection<GrantedAuthority> =
                listOf(SimpleGrantedAuthority("ROLE_${role.name}"))

        override fun getPassword(): String = password

        override fun getUsername(): String = email

        override fun isAccountNonExpired(): Boolean = true
        override fun isAccountNonLocked(): Boolean = true
        override fun isCredentialsNonExpired(): Boolean = true
        override fun isEnabled(): Boolean = true
}
