from fastapi import FastAPI
from routers import net_income, test, create_table
from routers import category

app = FastAPI()

app.include_router(test.route)
app.include_router(create_table.route)
app.include_router(net_income.route)
app.include_router(category.route)

@app.get("/helloworld")
def helloworld():
    return {"message": "Hello world."}