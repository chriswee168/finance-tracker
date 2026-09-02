from fastapi import FastAPI
from contextlib import asynccontextmanager
from routers import cash_amounts, transactions, timestamp
from fastapi.middleware.cors import CORSMiddleware
from utils.create_tables import create_tables
import os

# Call on FastAPI server startup.
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create SQL tables if they don't exist.
    create_tables()
    yield

app = FastAPI(lifespan=lifespan)

# Frontend URL for hosting FastAPI on Render.
FRONTEND_URL = os.getenv("FRONTEND_RENDER_URL", "http://127.0.0.1:5173")

# Origins to allow for Cross-Origin Resource Sharing in browser.
origins = [
    "http://localhost:5173", # Vite development.
    "http://127.0.0.1:5173",
    "http://localhost:4173", # Vite production preview.
    "http://127.0.0.1:4173",
    FRONTEND_URL
]

# Add CORS middleware.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Check API status.
@app.get("/")
def get_api_status():
    return {"status": "Backend API online."}

# Link all routers.
app.include_router(cash_amounts.route)
app.include_router(transactions.route)
app.include_router(timestamp.route)