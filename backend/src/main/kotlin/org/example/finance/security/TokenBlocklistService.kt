package org.example.finance.security

import org.springframework.stereotype.Service
import java.util.concurrent.ConcurrentHashMap

// --- Token Blocklist Service  ---
// This service is responsible for managing the list of invalidated tokens.

@Service
class TokenBlocklistService {
    private val blocklist = ConcurrentHashMap<String, Boolean>()

    fun addToBlocklist(token: String) {
        blocklist[token] = true
    }

    fun isBlocked(token: String): Boolean {
        return blocklist.containsKey(token)
    }
}
