import time
from fastapi import APIRouter, status, Response
from pydantic import BaseModel
import sqlite3, json

route = APIRouter()

class NetIncomeResponse(BaseModel):
    net_income_cents: int

# Involves cash amounts of net income and current balance in cents.
class CashAmounts(BaseModel):
    net_income_cents: int
    current_balance_cents: int

# Add net income and current balance to SQL tables.
@route.post("/cash-amounts", status_code=status.HTTP_204_NO_CONTENT)
def add_cash_amounts(cash_amounts: CashAmounts):
    conn = sqlite3.connect("finance_database.sqlite3")
    cursor = conn.cursor()

    current_datetime = time.strftime("%Y-%m-%d %I:%M:%S%p")
    
    add_cash_amounts_query = (
        "INSERT INTO amount_history_table "
        "(entry_datetime, net_income_cents, current_balance_cents) VALUES (?, ?, ?)"
        )

    cursor.execute(
        add_cash_amounts_query, 
        (current_datetime, cash_amounts.net_income_cents, cash_amounts.current_balance_cents)
    )
    conn.commit()
    conn.close()

    return Response(status_code=status.HTTP_204_NO_CONTENT)

# Save the current net income and current balance to JSON config.
@route.post("/current-cash-amounts", status_code=status.HTTP_204_NO_CONTENT)
def save_current_cash_amounts(cash_amounts: CashAmounts):
    with open("config.json", "w") as f:
        json.dump({
            "net_income_cents": cash_amounts.net_income_cents,
            "current_balance_cents": cash_amounts.current_balance_cents
        }, f, indent=4)
    
    print((
        "Save current cash amounts:\n"
        f"Net income cents: {cash_amounts.net_income_cents}\n"
        f"Current balance cents: {cash_amounts.current_balance_cents}"
    ))
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# Get the current net income and current balance from JSON config.
@route.get("/current-cash-amounts", status_code=status.HTTP_200_OK)
def get_current_cash_amounts():
    with open("config.json", "r") as f:
        amount_data = json.load(f)
    
    return amount_data

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