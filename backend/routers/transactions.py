from fastapi import APIRouter, status
import sqlite3
import time

route = APIRouter()

# Add transaction entry to transaction table.
@route.post("/add-transaction", status_code=status.HTTP_204_NO_CONTENT)
def add_transaction(transaction_type: str, transaction_desc: str, amount_cents: int):
    conn = sqlite3.connect("finance_database.sqlite3")
    cursor = conn.cursor()

    get_n_entries_query = "SELECT COUNT(entry_id) FROM transaction_table"
    cursor.execute(get_n_entries_query)
    entry_id = cursor.fetchall()[0][0]
    current_date = time.strftime("%Y-%m-%d")

    add_transaction_query = (
        "INSERT INTO transaction_table "
        "(entry_id, entry_date, transaction_type, transaction_desc, amount_cents) "
        "VALUES (?, ?, ?, ?, ?)"
    )

    cursor.execute(
        add_transaction_query, 
        (entry_id, current_date, transaction_type, transaction_desc, amount_cents)
    )
    conn.commit()
    conn.close()

    print((
        "Added transaction:\n" \
        f"Date: {current_date}\n" \
        f"Transaction type: {transaction_type}\n" \
        f"Description: {transaction_desc}\n" \
        f"Cash amount (cents): {amount_cents}"
    ))