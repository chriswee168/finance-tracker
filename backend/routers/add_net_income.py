from fastapi import APIRouter
import sqlite3
import os

route = APIRouter()

# Add to net income SQL table.
@route.post("/add-net-income")
def add_net_income(entry_id: int, entry_date: str, ammount: str):
    conn = sqlite3.connect("finance_database.sqlite3")
    cursor = conn.cursor()

    add_net_income_query = (
        "INSERT INTO net_income_table (entry_id, entry_date, ammount) "
        f"VALUES ({entry_id}, {entry_date}, {ammount})"
    )

    cursor.execute(add_net_income_query)
    conn.commit()
    conn.close()