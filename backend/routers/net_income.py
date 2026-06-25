from fastapi import APIRouter
from pydantic import BaseModel
import sqlite3
import os

route = APIRouter()

class NetIncomeResponse(BaseModel):
    net_income_cents: int

# Add to net income SQL table.
@route.post("/add-net-income")
def add_net_income(entry_date: str, ammount: str):
    conn = sqlite3.connect("finance_database.sqlite3")
    cursor = conn.cursor()

    add_net_income_query = (
        "INSERT INTO net_income_table (entry_date, ammount) "
        f"VALUES ({entry_date}, {ammount})"
    )

    cursor.execute(add_net_income_query)
    conn.commit()
    conn.close()

# Calculate the net income from the income and expenses SQL table.
@route.get("/calc-net-income", response_model=NetIncomeResponse)
def calc_net_income():
    conn = sqlite3.connect("finance_database.sqlite3")
    cursor = conn.cursor()

    obtain_income_sum_query = "SELECT SUM(amount_cents) FROM net_income_table WHERE category_type = 'income'"
    obtain_expenses_sum_query = "SELECT SUM(amount_cents) FROM net_income_table WHERE category_type = 'expense'"

    # Get income and expense sum.
    cursor.execute(obtain_income_sum_query)
    income_sum = cursor.fetchall()
    cursor.execute(obtain_expenses_sum_query)
    expenses_sum = cursor.fetchall()
    conn.close()

    # Net income = total income - total expenses
    net_income = income_sum - expenses_sum

    return {"net_income": net_income}