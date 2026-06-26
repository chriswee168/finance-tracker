from fastapi import FastAPI
from routers import net_income, create_table
from routers import category

app = FastAPI()

# Link all routers.
app.include_router(create_table.route)
app.include_router(net_income.route)
app.include_router(category.route)