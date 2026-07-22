from fastapi import FastAPI
from contextlib import asynccontextmanager
from routers import cash_amounts, transactions
from fastapi.middleware.cors import CORSMiddleware
from create_tables import create_tables

# Call on FastAPI server startup.
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting FastAPI server...")
    create_tables()
    print("Called create_tables() function...")
    
    yield

    print("Shutting down FastAPI server...")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Link all routers.
app.include_router(cash_amounts.route)
app.include_router(transactions.route)