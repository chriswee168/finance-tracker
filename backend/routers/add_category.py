from fastapi import APIRouter
import sqlite3

route = APIRouter()

# Add to category SQL table.
@route.post("/add-category")
def add_category(category: str, category_type: str):
    conn = sqlite3.connect("finance_database.sqlite3")
    cursor = conn.cursor()

    add_category_query = (
        "INSERT INTO category_table (category, category_type) "
        f"VALUES ({category}, {category_type})"
    )

    cursor.execute(add_category_query)
    conn.commit()
    conn.close()