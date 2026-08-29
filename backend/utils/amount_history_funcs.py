import sqlite3
from utils.constants import *

def append_amount_history_entry(cursor: sqlite3.Cursor, timestamp: int):
    """
    Append new amount history entry with specified timestamp.
    """
    cursor.execute((
        "INSERT INTO amount_history_table (entry_timestamp, net_income_cents, current_balance_cents) "
        "VALUES (?, 0, 0)", (timestamp,)
    ))
    
def get_latest_amount_history(cursor: sqlite3.Cursor) -> tuple:
    """
    Get latest amount_history_table entry ID.
    """
    cursor.execute("SELECT * FROM amount_history_table ORDER BY entry_id DESC LIMIT 1")
    latest_entry = cursor.fetchone()
    return latest_entry