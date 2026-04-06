package org.example.finance.services

import org.example.finance.mappers.UserMapper
import org.example.finance.models.requests.AccountRequestDTO
import org.example.finance.models.requests.LoginRequestDTO
import org.example.finance.models.requests.UserRequestDTO
import org.example.finance.models.responses.JwtResponse
import org.example.finance.models.responses.UserResponseDTO
import org.example.finance.repositories.AccountRepository
import org.example.finance.repositories.UserRepository
import org.example.finance.security.JwtProvider
import org.example.finance.security.TokenBlocklistService
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService(
        private val userRepository: UserRepository,
        private val accountService: AccountService,
        private val cardService: CardService,
        private val authenticationManager: AuthenticationManager,
        private val passwordEncoder: PasswordEncoder,
        private val jwtProvider: JwtProvider,
        private val tokenBlocklistService: TokenBlocklistService,
        private val accountRepository: AccountRepository,
        private val currentUser: CurrentUserService,
        private val emailService: EmailService
) {

    fun getUser(): UserResponseDTO {
        val account = currentUser.getLoggedAccount()
        val user =
                userRepository.findByAccount_Id(account.id)
                        ?: throw IllegalStateException("User not found for account")
        val history = account.let { accountService.getHistorySummary(it.iban) }
        val card = account.let { cardService.getCardForAccount(it) }
        return UserMapper.toResponseDTO(user, account, card, history)
    }

    fun createUser(requestDTO: UserRequestDTO): UserResponseDTO {
        if (userRepository.existsByEmail(requestDTO.email)) {
            throw IllegalArgumentException("Email ${requestDTO.email} is already taken")
        }

        val entity = UserMapper.toEntity(requestDTO, passwordEncoder.encode(requestDTO.password))
        val savedUser = userRepository.save(entity)

        val account = accountService.createAccount(AccountRequestDTO())
        val history = accountService.getHistorySummary(account.iban)
        val card = cardService.createCard()

        val updatedAcc = account.copy(card = card)
        accountRepository.save(updatedAcc)

        val finalUser = savedUser.copy(account = updatedAcc)
        userRepository.save(finalUser)

        emailService.sendNotification(
                finalUser.email,
                "Welcome to Finance App!",
                "Hello ${finalUser.fullName},\n\nYour account has been successfully created. Your new IBAN is: ${updatedAcc.iban}"
        )

        return UserMapper.toResponseDTO(finalUser, updatedAcc, card, history)
    }

    fun createSession(loginRequestDTO: LoginRequestDTO): JwtResponse {
        authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(loginRequestDTO.email, loginRequestDTO.password)
        )

        val user =
                userRepository
                        .findByEmail(loginRequestDTO.email)
                        .orElseThrow({
                            IllegalArgumentException("User ${loginRequestDTO.email} not found!")
                        })

        val jwt = jwtProvider.generateJwt(user)

        return JwtResponse(jwt)
    }

    fun signOut(token: String) {
        tokenBlocklistService.addToBlocklist(token)
    }

    fun deleteUser() {
        val account = currentUser.getLoggedAccount()
        val user =
                userRepository.findByAccount_Id(account.id)
                        ?: throw IllegalStateException("User not found for account")
        userRepository.delete(user)
    }
}
