from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import quote_plus

from app.config.settings import (
    DB_SERVER,
    DB_NAME,
    DB_DRIVER,
    DB_TRUSTED_CONNECTION,
    DB_TRUST_SERVER_CERTIFICATE,
)

connection_string = (
    f"DRIVER={{{DB_DRIVER}}};"
    f"SERVER={DB_SERVER};"
    f"DATABASE={DB_NAME};"
    f"Trusted_Connection={DB_TRUSTED_CONNECTION};"
    f"TrustServerCertificate={DB_TRUST_SERVER_CERTIFICATE};"
)

DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={quote_plus(connection_string)}"

engine = create_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def ensure_media_columns():
    inspector = inspect(engine)

    required_columns = {
        "ScheduledPosts": "MediaPath",
        "ApprovalQueue": "MediaPath",
    }

    with engine.begin() as connection:
        for table_name, column_name in required_columns.items():
            existing_columns = {column["name"] for column in inspector.get_columns(table_name)} if inspector.has_table(table_name) else set()

            if column_name not in existing_columns:
                connection.execute(
                    text(
                        f"ALTER TABLE {table_name} ADD {column_name} NVARCHAR(255) NULL"
                    )
                )

def ensure_clients_table():
    with engine.begin() as connection:
        connection.execute(
            text("""
                IF NOT EXISTS (
                    SELECT *
                    FROM sys.tables
                    WHERE name = 'Clients'
                )
                BEGIN
                    CREATE TABLE Clients (
                        Id INT IDENTITY(1,1) PRIMARY KEY,
                        UserId INT NOT NULL,
                        ClientName NVARCHAR(150) NOT NULL,
                        Status NVARCHAR(50) DEFAULT 'Active',
                        CreatedAt DATETIME2 DEFAULT GETDATE(),

                        CONSTRAINT FK_Clients_Users
                        FOREIGN KEY (UserId)
                        REFERENCES Users(Id)
                    )
                END
            """)
        )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()