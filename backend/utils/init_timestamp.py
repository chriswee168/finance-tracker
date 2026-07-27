
import json
import os
import time

from utils.constants import TIMESTAMP_CONFIG_PATH

# Set the initial epoch timestamp if timestamp config json file doesn't exist.
def init_timestamp():
    if not os.path.exists(TIMESTAMP_CONFIG_PATH):
        with open(TIMESTAMP_CONFIG_PATH, "w") as f:
            json.dump({"timestamp": int(time.time())}, f, indent=4)