from fastapi import APIRouter
import sqlite3
import time

route = APIRouter()

# Add to category SQL table.
@route.post("/add-category")
def add_category(category: str, transaction_type: str):
    conn = sqlite3.connect("finance_database.sqlite3")
    cursor = conn.cursor()

    add_category_query = (
        "INSERT INTO category_table (category, transaction_type) "
        f"VALUES ({category}, {transaction_type})"
    )

    cursor.execute(add_category_query)
    conn.commit()
    conn.close()

# Add transaction entry to income and expense table.
@route.post("/add-transaction")
def add_transaction(category: str, transaction_type: str, amount_cents: int):
    conn = sqlite3.connect("finance_database.sqlite3")
    cursor = conn.cursor()

    get_n_entries_query = "SELECT COUNT(entry_id) FROM income_expense_table"
    cursor.execute(get_n_entries_query)
    entry_id = cursor.fetchall()[0][0]
    current_date = time.strftime("%Y-%m-%d")

    add_transaction_query = (
        "INSERT INTO income_expense_table "
        "(entry_id, entry_date, category, transaction_type, amount_cents) "
        "VALUES (?, ?, ?, ?, ?)"
    )

    cursor.execute(add_transaction_query, (entry_id, current_date, category, transaction_type, amount_cents))

    conn.commit()
    conn.close()