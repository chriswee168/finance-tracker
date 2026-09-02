from fastapi import APIRouter, status
from pydantic import BaseModel
import sqlite3
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

# Get the net income and current balance from latest amount_history_table entry.
@route.get("/latest-cash-amounts", status_code=status.HTTP_200_OK)
def get_latest_cash_amounts():
    conn = sqlite3.connect(DATABASE_DIR_PATH + DATABASE_NAME_PATH)
    cursor = conn.cursor()
    latest_entry = get_latest_amount_history(cursor)
    
    return {
        "net_income_cents": latest_entry[2], 
        "current_balance_cents": latest_entry[3]
    }