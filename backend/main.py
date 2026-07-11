from fastapi import FastAPI
from routers import cash_amounts, create_table
from routers import transactions

app = FastAPI()

# Link all routers.
app.include_router(create_table.route)
app.include_router(cash_amounts.route)
app.include_router(transactions.route)