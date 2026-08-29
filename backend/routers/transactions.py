from fastapi import APIRouter, status, Response
from pydantic import BaseModel, Field
from typing import Literal
import sqlite3
from datetime import datetime
from utils.constants import *
from utils.timestamp_funcs import *
from utils.amount_history_funcs import *

route = APIRouter()

# Transactions require datetime, type, description and cash amount.
class Transaction(BaseModel):
    type: Literal["income", "expense"]
    desc: str
    amount_cents: int = Field(
        gt=0, description="Transaction cash amount must be greater than zero."
    )

# Add transaction entry to transaction_table and return new entry with ID.
@route.post("/transaction-entries", status_code=status.HTTP_201_CREATED)
def add_transaction(transaction: Transaction):
    conn = sqlite3.connect(DATABASE_DIR_PATH + DATABASE_NAME_PATH)
    cursor = conn.cursor()

    # Check if current timestamp has exceeded interval since previous one.
    if exceeded_timestamp_interval(cursor):
        # Create new amount_history_table entry.
        latest_timestamp = get_latest_timestamp(cursor)
        new_timestamp = latest_timestamp + TIMESTAMP_INTERVAL_SECS
        append_amount_history_entry(cursor, new_timestamp)

    latest_id = get_latest_amount_history_id(cursor)

    add_transaction_query = (
        "INSERT INTO transaction_table "
        "(transaction_type, transaction_desc, amount_cents, amount_history_id) "
        "VALUES (?, ?, ?, ?)"
    )
    
    cursor.execute(
        add_transaction_query, 
        (transaction.type, transaction.desc, transaction.amount_cents, latest_id)
    )

    latest_entry_id = cursor.lastrowid # Get ID of newly added transaction entry.
    conn.commit()

    get_timestamp_query = "SELECT entry_timestamp FROM transaction_table ORDER BY entry_id DESC LIMIT 1"
    cursor.execute(get_timestamp_query)
    timestamp = cursor.fetchone()[0]
    datetime_str = datetime.fromtimestamp(timestamp).strftime("%d/%b/%Y %I:%M:%S%p")
    
    conn.close()

    print((
        "Added transaction:\n" \
        f"ID: {latest_entry_id}\n" \
        f"Datetime: {datetime_str}\n" \
        f"Transaction type: {transaction.type}\n" \
        f"Description: {transaction.desc}\n" \
        f"Cash amount (cents): {transaction.amount_cents}"
    ))

    return {"entry_id": latest_entry_id, "entry_datetime": datetime_str}

# Obtain the latest N transaction entries.
@route.get("/transaction-entries", status_code=status.HTTP_200_OK)
def get_transaction(n_entries: int):
    conn = sqlite3.connect(DATABASE_DIR_PATH + DATABASE_NAME_PATH)
    cursor = conn.cursor()

    get_entries_query = "SELECT * FROM transaction_table ORDER BY entry_id DESC LIMIT ?"
    cursor.execute(get_entries_query, (n_entries,))
    all_entries = cursor.fetchall()
    conn.close()

    return [
        {
            "entry_id": entry[0], 
            "datetime": datetime.fromtimestamp(entry[1]).strftime("%d/%b/%Y %I:%M:%S%p"), 
            "type": entry[2], 
            "desc": entry[3], 
            "amount_cents": entry[4]
        } 
        for entry in all_entries
    ]