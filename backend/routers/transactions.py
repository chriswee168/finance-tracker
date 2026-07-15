from fastapi import APIRouter, status, Response
from pydantic import BaseModel
import sqlite3
import time

route = APIRouter()

# Transactions require type, description and cash amount.
class Transaction(BaseModel):
    type: str
    desc: str
    amount_cents: int

# Add transaction entry to transaction table.
@route.post("/transaction-entries", status_code=status.HTTP_204_NO_CONTENT)
def add_transaction(transaction: Transaction):
    conn = sqlite3.connect("finance_database.sqlite3")
    cursor = conn.cursor()

    get_n_entries_query = "SELECT COUNT(entry_id) FROM transaction_table"
    cursor.execute(get_n_entries_query)
    entry_id = cursor.fetchall()[0][0]
    current_datetime = time.strftime("%Y-%m-%d %I:%M:%S%p")

    add_transaction_query = (
        "INSERT INTO transaction_table "
        "(entry_id, entry_datetime, transaction_type, transaction_desc, amount_cents) "
        "VALUES (?, ?, ?, ?, ?)"
    )

    cursor.execute(
        add_transaction_query, 
        (entry_id, current_datetime, transaction.type, transaction.desc, transaction.amount_cents)
    )
    conn.commit()
    conn.close()

    print((
        "Added transaction:\n" \
        f"Datetime: {current_datetime}\n" \
        f"Transaction type: {transaction.type}\n" \
        f"Description: {transaction.desc}\n" \
        f"Cash amount (cents): {transaction.amount_cents}"
    ))

    return Response(status_code=status.HTTP_204_NO_CONTENT)