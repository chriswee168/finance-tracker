from fastapi import APIRouter, status
import sqlite3
import os

route = APIRouter()

# Create SQL table to record net income overtime.
@route.post("/create-tables", status_code=status.HTTP_204_NO_CONTENT)
def create_tables():
    conn = sqlite3.connect("finance_database.sqlite3")
    cursor = conn.cursor()
    
    # net_income_table: record the net income overtime.
    # current_balance_table: record the current balance.
    # transaction_table: record all transactions (income/expenses) entered by user.
    create_tables_query = (
        "CREATE TABLE IF NOT EXISTS net_income_table(" \
        "   entry_date DATE PRIMARY KEY," \
        "   amount_cents INT" \
        ");"

        "CREATE TABLE IF NOT EXISTS current_balance_table(" \
        "   entry_date DATE PRIMARY KEY," \
        "   amount_cents INT" \
        ");"

        "CREATE TABLE IF NOT EXISTS transaction_table(" \
        "   entry_id INT PRIMARY KEY," \
        "   entry_date DATE,"
        "   category VARCHAR(100),"
        "   transaction_type CHAR(7)," \
        "   amount_cents INT," \
        
        "   FOREIGN KEY (category) REFERENCES category_table(category) ON DELETE CASCADE" \
        ")"
    )

    cursor.executescript(create_tables_query)
    conn.commit()
    conn.close()