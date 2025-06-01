import psycopg2

def list_tables():
    conn = psycopg2.connect(
        dbname="election_database",
        user="postgres", 
        password="Mounish@123",
        host="localhost",
        port="5432"
    )
    cur = conn.cursor()
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
    tables = cur.fetchall()
    print('Tables in database:')
    for table in tables:
        print(f'  {table[0]}')
    conn.close()

if __name__ == '__main__':
    list_tables()