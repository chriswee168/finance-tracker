from datetime import datetime
from fastapi import APIRouter, status, Response
from pydantic import BaseModel
import sqlite3, json
from utils.constants import *
from utils.amount_history_funcs import set_amount_history_entry, get_latest_amount_history

route = APIRouter()

# Involves cash amounts of net income and current balance in cents.
class CashAmounts(BaseModel):
    net_income_cents: int
    current_balance_cents: int

# Update net income and current balance in latest amount_history_table entry.
@route.put("/latest-cash-amounts", status_code=status.HTTP_200_OK)
def set_latest_cash_amounts(cash_amounts: CashAmounts):
    conn = sqlite3.connect(DATABASE_DIR_PATH + DATABASE_NAME_PATH)
    cursor = conn.cursor()

    amount_history_entry = get_latest_amount_history(cursor)
    amount_history_id = amount_history_entry[0]

    set_amount_history_entry(
        cursor, 
        cash_amounts.net_income_cents, 
        cash_amounts.current_balance_cents,
        amount_history_id
    )
    conn.commit()
    latest_entry = get_latest_amount_history(cursor)
    conn.close()
    
    print((
        "Updated current cash amounts in amount history:\n"
        f"Net income cents: {cash_amounts.net_income_cents}\n"
        f"Current balance cents: {cash_amounts.current_balance_cents}"
    ))

    return {
        "net_income_cents": latest_entry[2], 
        "current_balance_cents": latest_entry[3]
    }

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