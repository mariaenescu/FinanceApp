package org.example.finance.controllers

import org.example.finance.models.Account
import org.example.finance.models.requests.AddFriendRequestDTO
import org.example.finance.models.requests.SearchFriendRequestDTO
import org.example.finance.models.responses.FriendResponseDTO
import org.example.finance.services.FriendService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/friends")
class FriendController(
    private val friendService: FriendService
) {
    @PostMapping("/add")
    fun addFriend(@RequestBody req: AddFriendRequestDTO): ResponseEntity<FriendResponseDTO> {
        val dto = friendService.addFriendByIban(req.iban)
        return ResponseEntity.ok(dto)
    }

    @GetMapping
    fun getFriends(): ResponseEntity<List<FriendResponseDTO>> {
        return ResponseEntity.ok(friendService.listFriends())
    }

    @PostMapping("/search")
    fun searchFriends(@RequestBody req: SearchFriendRequestDTO): ResponseEntity<List<FriendResponseDTO>> {
        return ResponseEntity.ok(friendService.searchFriends(req.nameOrMail))
    }
}