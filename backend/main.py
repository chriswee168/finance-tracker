from fastapi import FastAPI
from routers import test, create_table

app = FastAPI()

app.include_router(test.route)
app.include_router(create_table.route)

@app.get("/helloworld")
def helloworld():
    return {"message": "Hello world."}