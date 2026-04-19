package org.example.finance.controllers

import org.example.finance.models.requests.LoginRequestDTO
import org.example.finance.models.requests.UserRequestDTO
import org.example.finance.models.responses.JwtResponse
import org.example.finance.services.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/auth")
class AuthenticationController(private val userService: UserService) {

    @PostMapping
    fun registerUser(@RequestBody registerRequest: UserRequestDTO): ResponseEntity<*> {
        return try {
            val response = userService.createUser(registerRequest)
            ResponseEntity.status(HttpStatus.CREATED).body(response)
        } catch (e: IllegalArgumentException) {
            val errorResponse =
                    mapOf(
                            "message" to
                                    (e.message ?: "An error occurred while creating the account.")
                    )
            ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse)
        }
    }

    @PostMapping("/login")
    fun loginUser(@RequestBody loginRequestDTO: LoginRequestDTO): JwtResponse {
        return userService.createSession(loginRequestDTO)
    }

    @PostMapping("/signout")
    fun signOutUser(@RequestHeader("Authorization") authHeader: String): ResponseEntity<*> {
        if (authHeader.startsWith("Bearer ")) {
            val token = authHeader.substring(7)
            userService.signOut(token)
            return ResponseEntity.ok().body("User signed out successfully")
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Authorization header")
    }
}
