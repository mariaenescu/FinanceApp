package org.example.finance.mappers

import org.example.finance.enums.TransactionType
import org.example.finance.models.Expense
import org.example.finance.models.Income
import org.example.finance.models.responses.TransactionDTO

object TransactionMapper {
    fun fromIncome(i: Income, senderName: String) = TransactionDTO(
        type = TransactionType.INCOME,
        amount = i.amount,
        description = i.description,
        ibanSender = i.ibanSender,
        ibanReceiver = i.ibanReceiver,
        date = i.date,
        fromOrTo = senderName
    )

    fun fromExpense(e: Expense, receiverName: String) = TransactionDTO(
        type = TransactionType.EXPENSE,
        amount = e.amount,
        description = e.description,
        ibanReceiver = e.ibanReceiver,
        ibanSender = e.ibanSender,
        date = e.date,
        fromOrTo = receiverName
    )
}