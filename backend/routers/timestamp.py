from fastapi import APIRouter, status, Response
from pydantic import BaseModel
import os, json, time
from utils.constants import *

route = APIRouter()

class EpochTime(BaseModel):
    secs: int

# Set the initial epoch timestamp if timestamp.json doesn't exist.
def init_timestamp():
    if not os.path.exists(TIMESTAMP_CONFIG_PATH):
        with open(TIMESTAMP_CONFIG_PATH, "w") as f:
            json.dump({"timestamp": int(time.time())}, f, indent=4)


# Save the current timestamp to JSON config.
@route.put("/utc-epoch-timestamp", status_code=status.HTTP_204_NO_CONTENT)
def save_timestamp(epoch_time: EpochTime):
    with open(TIMESTAMP_CONFIG_PATH, "w") as f:
        json.dump({"timestamp": int(time.time())}, f, indent=4)
    
    print(f"Epoch time (secs): {epoch_time.secs}")
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# Get the current timestamp from JSON config.
@route.get("/utc-epoch-timestamp", status_code=status.HTTP_200_OK)
def get_timestamp():
    with open(TIMESTAMP_CONFIG_PATH, "r") as f:
        timestamp_data = json.load(f)
    
    return timestamp_data