from fastapi import APIRouter
import sqlite3
import os

route = APIRouter()

# Create SQL table to record net income overtime.
@route.patch("/create-tables")
def create_tables():
    conn = sqlite3.connect("finance_database.sqlite3")
    cursor = conn.cursor()
        
    create_net_income_query = (
        "CREATE TABLE IF NOT EXISTS net_income_table(" \
        "   entry_date DATE PRIMARY KEY," \
        "   amount_cents INT" \
        ")"
    )

    create_category_table_query = (
        "CREATE TABLE IF NOT EXISTS category_table(" \
        "   category VARCHAR(100) PRIMARY KEY," \
        "   category_type CHAR(7)" \
        ")"
    )

    create_income_expense_table_query = (
        "CREATE TABLE IF NOT EXISTS income_expense_table(" \
        "   entry_id INT PRIMARY KEY," \
        "   entry_date DATE,"
        "   category VARCHAR(100),"
        "   category_type CHAR(7)," \
        "   amount_cents INT," \
        
        "   FOREIGN KEY (category) REFERENCES category_table(category) ON DELETE CASCADE" \
        ")"
    )

    cursor.execute(create_net_income_query)
    cursor.execute(create_category_table_query)
    cursor.execute(create_income_expense_table_query)
    conn.commit()
    conn.close()