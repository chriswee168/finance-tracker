import sqlite3, time
from utils.amount_history_funcs import append_amount_history_entry, get_latest_amount_history
from utils.constants import *

def get_latest_timestamp(cursor: sqlite3.Cursor) -> int:
    """
    Get timestamp epoch of latest amount_history_table entry.
    """
    cursor.execute("SELECT entry_timestamp FROM amount_history_table ORDER BY entry_id DESC LIMIT 1")
    prev_epoch = cursor.fetchone()[0]
    return prev_epoch
    
def exceeded_timestamp_interval(cursor: sqlite3.Cursor) -> bool:
    '''
    Determine if timestamp interval has been exceeded.
    '''
    prev_epoch = get_latest_timestamp(cursor)
    current_epoch = int(time.time())

    if current_epoch - prev_epoch >= TIMESTAMP_INTERVAL_SECS:
        return True
    else:
        return False

def timestamp_update(cursor: sqlite3.Cursor, conn: sqlite3.Connection) -> int:
    '''
    Create new amount history entry if interval from last timestamp exceeded.
    '''
    if exceeded_timestamp_interval(cursor):
        # Create new amount_history_table entry.
        latest_amount_entry = get_latest_amount_history(cursor)
        latest_timestamp = latest_amount_entry[1]
        new_timestamp = latest_timestamp + TIMESTAMP_INTERVAL_SECS
        append_amount_history_entry(cursor, new_timestamp, latest_amount_entry[3])
        conn.commit()
    
    latest_timestamp = get_latest_timestamp(cursor)

    return latest_timestamp