import os, json, time
from utils.constants import *

# Set the initial epoch timestamp if timestamp.json doesn't exist.
def init_timestamp():
    if not os.path.exists(TIMESTAMP_CONFIG_PATH):
        with open(TIMESTAMP_CONFIG_PATH, "w") as f:
            json.dump({"timestamp": int(time.time())}, f, indent=4)