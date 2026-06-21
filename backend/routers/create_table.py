from fastapi import APIRouter
import sqlite3
import os

route = APIRouter()

# Create SQL table to record net income overtime.
@route.patch("/create-tables")
def create_tables():
    if not os.path.exists("finance_database.sqlite3"):
        conn = sqlite3.connect("finance_database.sqlite3")
        cursor = conn.cursor()
        
        create_net_income_query = (
            "CREATE TABLE net_income_table(" \
            "   entry_id INT PRIMARY KEY," \
            "   entry_date DATE," \
            "   amount VARCHAR(10)," \
            ")"
        )

        create_category_table_query = (
            "CREATE TABLE category_table(" \
            "   category VARCHAR(100) PRIMARY KEY," \
            "   category_type CHAR(7)" \
            ")"
        )

        create_income_expense_table_query = (
            "CREATE TABLE income_expense_table(" \
            "   entry_id INT PRIMARY KEY," \
            "   entry_date DATE,"
            "   category CHAR(7)," \
            "   amount VARCHAR(10)," \
            ")"
        )

        cursor.execute(create_net_income_query)
        cursor.execute(create_category_table_query)
        cursor.execute(create_income_expense_table_query)
        conn.commit()
        conn.close()