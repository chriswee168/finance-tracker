import sqlite3
from fastapi import APIRouter, status
from utils.amount_history_funcs import *
from utils.constants import *
from utils.timestamp_funcs import *

route = APIRouter()

# Get the latest timestamp from latest amount history entry.
@route.post("/utc-epoch-timestamp", status_code=status.HTTP_200_OK)
def get_timestamp():
    conn = sqlite3.connect(DATABASE_DIR_PATH + DATABASE_NAME_PATH)
    cursor = conn.cursor()

    # Check if current timestamp has exceeded interval since previous one.
    if exceeded_timestamp_interval(cursor):
        # Create new amount_history_table entry.
        latest_amount_entry = get_latest_amount_history(cursor)
        latest_timestamp = latest_amount_entry[1]
        new_timestamp = latest_timestamp + TIMESTAMP_INTERVAL_SECS
        append_amount_history_entry(cursor, new_timestamp, latest_amount_entry[3])
        conn.commit()

    latest_timestamp = get_latest_timestamp(cursor)
    conn.commit()
    conn.close()

    return {"timestamp": latest_timestamp}