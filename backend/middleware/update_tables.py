import psycopg2
from psycopg2 import sql

def update_database_schema():
    """Update database schema to include Users table and any missing columns"""
    commands = (
        """
        CREATE TABLE IF NOT EXISTS Users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) CHECK (role IN ('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer', 'elector')) NOT NULL,
            linkedId INTEGER,
            email VARCHAR(255) NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """,
        """
        ALTER TABLE Parties ADD COLUMN IF NOT EXISTS symbol VARCHAR(255)
        """,
        """
        ALTER TABLE Constituencies ADD COLUMN IF NOT EXISTS code VARCHAR(50)
        """,
        """
        ALTER TABLE Constituencies ADD COLUMN IF NOT EXISTS description TEXT
        """,
        """
        ALTER TABLE Candidates ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'approved'
        """,
        """
        CREATE INDEX IF NOT EXISTS idx_votes_candidate ON Votes(candidateId)
        """,
        """
        CREATE INDEX IF NOT EXISTS idx_candidates_constituency ON Candidates(constituencyId)
        """,
        """
        CREATE INDEX IF NOT EXISTS idx_candidates_party ON Candidates(partyId)
        """,
        """
        CREATE INDEX IF NOT EXISTS idx_electors_station ON Electors(pollingStationId)
        """
    )

    conn = None
    try:
        # Connect to your postgres DB
        conn = psycopg2.connect(
            dbname="election_database",
            user="postgres",
            password="Mounish@123",
            host="localhost",
            port="5432"
        )
        cur = conn.cursor()
        
        for command in commands:
            try:
                cur.execute(command)
                print(f"✅ Executed: {command[:50]}...")
            except Exception as e:
                print(f"⚠️ Warning for command {command[:50]}...: {e}")
                
        conn.commit()
        cur.close()
        print("✅ Database schema updated successfully.")
        
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"❌ Error: {error}")
        if conn:
            conn.rollback()
    finally:
        if conn is not None:
            conn.close()

if __name__ == '__main__':
    update_database_schema()
