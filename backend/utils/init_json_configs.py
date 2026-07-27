
import json
import os
import time

from utils.constants import CASH_AMOUNT_CONFIG_PATH, TIMESTAMP_CONFIG_PATH

# Set the initial cash amounts if cash amount config JSON file doesn't exist.
def init_cash_amounts():
    if not os.path.exists(CASH_AMOUNT_CONFIG_PATH):
        with open(CASH_AMOUNT_CONFIG_PATH, "w") as f:
            json.dump({
                "net_income_cents": 0,
                "current_balance_cents": 0
            }, f, indent=4)

# Set the initial epoch timestamp if timestamp config JSON file doesn't exist.
def init_timestamp():
    if not os.path.exists(TIMESTAMP_CONFIG_PATH):
        with open(TIMESTAMP_CONFIG_PATH, "w") as f:
            json.dump({"timestamp": int(time.time())}, f, indent=4)