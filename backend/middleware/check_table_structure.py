import psycopg2

def check_table_structure():
    """Check the actual structure of database tables"""
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="election_database",
            user="postgres",
            password="Mounish@123"
        )
        cursor = conn.cursor()
        
        # Get all table names
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        """)
        tables = [row[0] for row in cursor.fetchall()]
        
        print("=== DATABASE TABLES AND THEIR STRUCTURE ===\n")
        
        for table in tables:
            print(f"TABLE: {table.upper()}")
            print("-" * 50)
            
            # Get column information
            cursor.execute("""
                SELECT column_name, data_type, character_maximum_length, 
                       is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = %s 
                ORDER BY ordinal_position
            """, (table,))
            
            columns = cursor.fetchall()
            for col_name, data_type, max_length, nullable, default in columns:
                length_info = f"({max_length})" if max_length else ""
                nullable_info = "NULL" if nullable == "YES" else "NOT NULL"
                default_info = f" DEFAULT {default}" if default else ""
                
                print(f"  {col_name:<20} {data_type}{length_info:<15} {nullable_info}{default_info}")
            
            print()
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_table_structure()
