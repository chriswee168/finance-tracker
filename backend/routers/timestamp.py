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
    latest_timestamp = timestamp_update(cursor, conn)
    conn.close()

    return {"timestamp": latest_timestamp}