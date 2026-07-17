from sqlalchemy import text
from app.config.database import engine

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT @@VERSION"))
        print("✅ Database Connected Successfully!")
        print(result.fetchone()[0])
except Exception as e:
    print(" Connection Failed")
    print(e)