from fastapi import APIRouter

route = APIRouter()

data = []

@route.post("/test")
def test(string: str):
    return {"message": f"Sent string: {string}."}