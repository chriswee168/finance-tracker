
import json
import os

from utils.constants import CASH_AMOUNT_CONFIG_PATH

# Set the initial cash amounts if cash amount config json file doesn't exist.
def init_cash_amounts():
    if not os.path.exists(CASH_AMOUNT_CONFIG_PATH):
        with open(CASH_AMOUNT_CONFIG_PATH, "w") as f:
            json.dump({
                "net_income_cents": 0,
                "current_balance_cents": 0
            }, f, indent=4)