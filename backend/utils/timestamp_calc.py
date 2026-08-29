import sqlite3, time
from constants import *

def get_latest_timestamp(cursor: sqlite3.Cursor):
    """
    Get timestamp epoch of latest amount_history_table entry.
    """
    cursor.execute("SELECT entry_timestamp FROM amount_history_table ORDER BY entry_id DESC LIMIT 1")
    prev_epoch = cursor.fetchone()[0]
    return prev_epoch
    
def exceeded_timestamp_interval(cursor: sqlite3.Cursor):
    '''
    Determine if timestamp interval has been exceeded.
    '''
    prev_epoch = get_latest_timestamp(cursor)
    current_epoch = int(time.time())

    if current_epoch - prev_epoch >= TIMESTAMP_INTERVAL_SECS:
        return True
    else:
        return False