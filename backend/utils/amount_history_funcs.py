import sqlite3
from utils.constants import *

def append_amount_history_entry(cursor: sqlite3.Cursor, timestamp: int, current_balance_cents: int):
    """
    Append new amount history entry with specified timestamp.
    """
    cursor.execute((
        "INSERT INTO amount_history_table (entry_timestamp, net_income_cents, current_balance_cents) "
        "VALUES (?, 0, ?)", (timestamp, current_balance_cents)
    ))

def set_amount_history_entry(
    cursor: sqlite3.Cursor, 
    new_net_income_cents: int,
    new_current_balance_cents: int,
    entry_id: int
):
    """
    Set new values for an amount history table entry.
    """
    cursor.execute((
        "UPDATE amount_history_table "
        "SET net_income_cents = ?,"
        "current_balance_cents = ? "
        "WHERE entry_id = ?"
    ), (new_net_income_cents, new_current_balance_cents, entry_id))
    
def get_latest_amount_history(cursor: sqlite3.Cursor) -> tuple:
    """
    Get latest amount_history_table entry.
    """
    cursor.execute("SELECT * FROM amount_history_table ORDER BY entry_id DESC LIMIT 1")
    latest_entry = cursor.fetchone()
    return latest_entry