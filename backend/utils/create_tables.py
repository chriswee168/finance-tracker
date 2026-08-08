import sqlite3, os
from utils.constants import *

# Create all required SQL tables if they do not exist.
def create_tables():
    # If it doesnt exist.
    if not os.path.exists(DATABASE_DIR_PATH):
        os.makedirs(DATABASE_DIR_PATH)

    conn = sqlite3.connect(DATABASE_DIR_PATH + DATABASE_NAME_PATH)
    cursor = conn.cursor()
    
    # amount_history_table: record the net income and current balance overtime.
    # transaction_table: record all transactions (income/expenses) entered by user.
    create_tables_query = (
        "CREATE TABLE IF NOT EXISTS amount_history_table(" \
        "   entry_id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "   entry_timestamp INT DEFAULT (strftime('%s', 'now'))," \
        "   net_income_cents INT," \
        "   current_balance_cents INT" \
        ");"

        "CREATE TABLE IF NOT EXISTS transaction_table(" \
        "   entry_id INTEGER PRIMARY KEY AUTOINCREMENT," \
        "   entry_timestamp INT DEFAULT (strftime('%s', 'now')),"
        "   transaction_type VARCHAR(7)," \
        "   transaction_desc TEXT," \
        "   amount_cents INT" \
        ")"
    )

    cursor.executescript(create_tables_query)
    conn.commit()
    conn.close()