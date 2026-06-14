from fastapi import FastAPI
from routers import test

app = FastAPI()

app.include_router(test.route)

@app.get("/helloworld")
def helloworld():
    return {"message": "Hello world."}