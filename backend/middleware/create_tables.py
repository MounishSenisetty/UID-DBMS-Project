import psycopg2
from psycopg2 import sql

def create_tables():
    commands = (
        """
        CREATE TABLE IF NOT EXISTS Constituencies (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS Parties (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            symbol VARCHAR(255)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS PoliticalParties (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            abbreviation VARCHAR(50),
            foundedYear INTEGER,
            ideology VARCHAR(255)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS PollingStations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            area VARCHAR(255) NOT NULL,
            ward VARCHAR(255) NOT NULL,
            constituencyId INTEGER REFERENCES Constituencies(id) ON DELETE SET NULL ON UPDATE CASCADE
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS Officers (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            role VARCHAR(50) CHECK (role IN ('returning', 'registration', 'polling', 'presiding')) NOT NULL,
            pollingStationId INTEGER REFERENCES PollingStations(id) ON DELETE SET NULL ON UPDATE CASCADE
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS Electors (
            id SERIAL PRIMARY KEY,
            serialNumber VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255) NOT NULL,
            pollingStationId INTEGER REFERENCES PollingStations(id) ON DELETE SET NULL ON UPDATE CASCADE
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS Candidates (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            partyId INTEGER REFERENCES Parties(id) ON DELETE SET NULL ON UPDATE CASCADE,
            constituencyId INTEGER REFERENCES Constituencies(id) ON DELETE SET NULL ON UPDATE CASCADE
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS Votes (
            electorSerialNumber VARCHAR(255) PRIMARY KEY REFERENCES Electors(serialNumber) ON DELETE CASCADE ON UPDATE CASCADE,
            candidateId INTEGER NOT NULL REFERENCES Candidates(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
        """
    )

    conn = None
    try:
        # Connect to your postgres DB - adjust parameters as needed
        conn = psycopg2.connect(
            dbname="election_management",
            user="postgres",
            password="Mounish@123",
            host="localhost",
            port="5432"
        )
        cur = conn.cursor()
        for command in commands:
            cur.execute(command)
        conn.commit()
        cur.close()
        print("Tables created successfully.")
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
    finally:
        if conn is not None:
            conn.close()

if __name__ == '__main__':
    create_tables()
