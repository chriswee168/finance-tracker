from fastapi import APIRouter, status
import sqlite3
import time

route = APIRouter()

# Add transaction entry to income and expense table.
@route.post("/add-transaction", status_code=status.HTTP_204_NO_CONTENT)
def add_transaction(category: str, transaction_type: str, amount_cents: int):
    conn = sqlite3.connect("finance_database.sqlite3")
    cursor = conn.cursor()

    get_n_entries_query = "SELECT COUNT(entry_id) FROM transaction_table"
    cursor.execute(get_n_entries_query)
    entry_id = cursor.fetchall()[0][0]
    current_date = time.strftime("%Y-%m-%d")

    add_transaction_query = (
        "INSERT INTO transaction_table "
        "(entry_id, entry_date, category, transaction_type, amount_cents) "
        "VALUES (?, ?, ?, ?, ?)"
    )

    cursor.execute(add_transaction_query, (entry_id, current_date, category, transaction_type, amount_cents))

    conn.commit()
    conn.close()