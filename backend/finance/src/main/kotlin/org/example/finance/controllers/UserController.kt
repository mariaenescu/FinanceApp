package org.example.finance.controllers


import org.example.finance.models.responses.UserResponseDTO
import org.example.finance.services.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/user")
class UserController(private val userService: UserService) {

    @GetMapping
    fun getMyUserAccount(): ResponseEntity<UserResponseDTO?> {
        return ResponseEntity.ok(userService.getUser())
    }

    @DeleteMapping()
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteUser() {
        userService.deleteUser()
    }
}