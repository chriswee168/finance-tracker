import time
from fastapi import APIRouter, status, Response
from pydantic import BaseModel
import sqlite3, json
from utils.constants import *

route = APIRouter()

# Involves cash amounts of net income and current balance in cents.
class CashAmounts(BaseModel):
    net_income_cents: int
    current_balance_cents: int

# Add net income and current balance to amount_history_table.
@route.post("/cash-amounts", status_code=status.HTTP_204_NO_CONTENT)
def add_cash_amounts(cash_amounts: CashAmounts):
    conn = sqlite3.connect(DATABASE_DIR_PATH + DATABASE_NAME_PATH)
    cursor = conn.cursor()

    current_datetime = time.strftime("%Y-%m-%d %I:%M:%S%p")
    
    add_cash_amounts_query = (
        "INSERT INTO amount_history_table "
        "(entry_datetime, net_income_cents, current_balance_cents) "
        "VALUES (?, ?, ?)"
        )

    cursor.execute(
        add_cash_amounts_query, 
        (current_datetime, cash_amounts.net_income_cents, cash_amounts.current_balance_cents)
    )
    conn.commit()
    conn.close()

    print((
        "Record current cash amounts to amount history:\n"
        f"Net income cents: {cash_amounts.net_income_cents}\n"
        f"Current balance cents: {cash_amounts.current_balance_cents}"
    ))

    return Response(status_code=status.HTTP_204_NO_CONTENT)

# Save the current net income and current balance to JSON config.
@route.put("/current-cash-amounts", status_code=status.HTTP_204_NO_CONTENT)
def save_current_cash_amounts(cash_amounts: CashAmounts):
    with open(CASH_AMOUNT_CONFIG_PATH, "w") as f:
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
    with open(CASH_AMOUNT_CONFIG_PATH, "r") as f:
        amount_data = json.load(f)
    
    return amount_data