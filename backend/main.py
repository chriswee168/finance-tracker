from fastapi import FastAPI
from routers import test, create_table
from routers import add_net_income, add_category

app = FastAPI()

app.include_router(test.route)
app.include_router(create_table.route)
app.include_router(add_net_income.route)
app.include_router(add_category.route)

@app.get("/helloworld")
def helloworld():
    return {"message": "Hello world."}