from fastapi import APIRouter, status, Response
from pydantic import BaseModel, Field
import sqlite3
from utils.constants import *

route = APIRouter()

# Transactions require datetime, type, description and cash amount.
class Transaction(BaseModel):
    datetime: str
    type: str
    desc: str
    amount_cents: int = Field(
        gt=0, description="Transaction cash amount must be greater than zero."
    )

# Add transaction entry to transaction table and return new entry with ID.
@route.post("/transaction-entries", status_code=status.HTTP_201_CREATED)
def add_transaction(transaction: Transaction):
    conn = sqlite3.connect(DATABASE_DIR_PATH + DATABASE_NAME_PATH)
    cursor = conn.cursor()

    add_transaction_query = (
        "INSERT INTO transaction_table "
        "(entry_datetime, transaction_type, transaction_desc, amount_cents) "
        "VALUES (?, ?, ?, ?)"
    )

    cursor.execute(
        add_transaction_query, 
        (transaction.datetime, transaction.type, transaction.desc, transaction.amount_cents)
    )

    latest_entry_id = cursor.lastrowid # Get ID of newly added transaction entry.
    conn.commit()
    conn.close()

    print((
        "Added transaction:\n" \
        f"ID: {latest_entry_id}\n" \
        f"Datetime: {transaction.datetime}\n" \
        f"Transaction type: {transaction.type}\n" \
        f"Description: {transaction.desc}\n" \
        f"Cash amount (cents): {transaction.amount_cents}"
    ))

    return {
        "entry_id": latest_entry_id,
        "datetime": transaction.datetime,
        "type": transaction.type,
        "desc": transaction.desc,
        "amount_cents": transaction.amount_cents
    }

# Obtain the latest N transaction entries.
@route.get("/transaction-entries", status_code=status.HTTP_200_OK, response_model=list[Transaction])
def get_transaction(n_entries: int):
    conn = sqlite3.connect(DATABASE_DIR_PATH + DATABASE_NAME_PATH)
    cursor = conn.cursor()

    get_entries_query = "SELECT * FROM transaction_table ORDER BY entry_id DESC LIMIT ?"
    cursor.execute(get_entries_query, (n_entries,))
    all_entries = cursor.fetchall()
    conn.close()

    return [
        {"datetime": entry[1], "type": entry[2], "desc": entry[3], "amount_cents": entry[4]} 
        for entry in all_entries
    ]