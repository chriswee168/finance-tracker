from fastapi import APIRouter, status
from pydantic import BaseModel
import sqlite3
import os

route = APIRouter()

class NetIncomeResponse(BaseModel):
    net_income_cents: int

# Add net income and current balance to SQL tables.
@route.post("/add-cash-amount", status_code=status.HTTP_204_NO_CONTENT)
def add_cash_amounts(entry_date: str, net_income_cents: str, current_balance_cents: str):
    conn = sqlite3.connect("finance_database.sqlite3")
    cursor = conn.cursor()

    add_cash_amounts_query = (
        "INSERT INTO amount_history_table "
        "(entry_date, net_income_cents, current_balance_cents) VALUES (?, ?, ?)"
        )

    cursor.execute(add_cash_amounts_query, (entry_date, net_income_cents, current_balance_cents))
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