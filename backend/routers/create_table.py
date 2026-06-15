from fastapi import APIRouter
import sqlite3
import os

route = APIRouter()

# Create SQL table to record net income overtime.
@route.patch("/create-net-income-table")
def create_net_income_table():
    if not os.path.exists("finance_database.sqlite3"):
        conn = sqlite3.connect("finance_database.sqlite3")
        cursor = conn.cursor()
        
        create_table_query = (
            "CREATE TABLE net_income_table(" \
            "   entry_id INT PRIMARY KEY," \
            "   entry_date DATE," \
            "   amount VARCHAR(10)," \
            ")"
        )

        cursor.execute(create_table_query)
        conn.commit()
        conn.close()