package org.example.finance.services

import java.lang.RuntimeException

class RequiresCvvException(message: String): RuntimeException(message)