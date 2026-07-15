from fastapi import APIRouter, status
import sqlite3
import os

route = APIRouter()

# Create SQL table to record net income overtime.
@route.post("/create-tables", status_code=status.HTTP_204_NO_CONTENT)
def create_tables():
    conn = sqlite3.connect("finance_database.sqlite3")
    cursor = conn.cursor()
    
    # amount_history_table: record the net income and current balance overtime.
    # transaction_table: record all transactions (income/expenses) entered by user.
    create_tables_query = (
        "CREATE TABLE IF NOT EXISTS amount_history_table(" \
        "   entry_datetime TEXT PRIMARY KEY," \
        "   net_income_cents INT," \
        "   current_balance_cents INT" \
        ");"

        "CREATE TABLE IF NOT EXISTS transaction_table(" \
        "   entry_id INT PRIMARY KEY," \
        "   entry_datetime TEXT,"
        "   transaction_type VARCHAR(7)," \
        "   transaction_desc TEXT," \
        "   amount_cents INT" \
        ")"
    )

    cursor.executescript(create_tables_query)
    conn.commit()
    conn.close()