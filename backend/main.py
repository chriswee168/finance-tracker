from fastapi import FastAPI
from routers import cash_amounts, create_table
from routers import transactions
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

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
app.include_router(create_table.route)
app.include_router(cash_amounts.route)
app.include_router(transactions.route)