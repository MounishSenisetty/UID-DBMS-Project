#!/usr/bin/env python3

import psycopg2
import sys

# Database connection parameters
DB_HOST = "localhost"
DB_NAME = "election_db"
DB_USER = "postgres"
DB_PASSWORD = "Mounish@123"

def check_table_structure():
    try:
        # Connect to database
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cur = conn.cursor()
        
        # Check votes table structure
        print("=== VOTES TABLE STRUCTURE ===")
        cur.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'votes' 
            ORDER BY ordinal_position;
        """)
        for row in cur.fetchall():
            print(f"  {row[0]} | {row[1]} | Nullable: {row[2]} | Default: {row[3]}")
        
        # Check pollingstations table structure
        print("\n=== POLLINGSTATIONS TABLE STRUCTURE ===")
        cur.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'pollingstations' 
            ORDER BY ordinal_position;
        """)
        for row in cur.fetchall():
            print(f"  {row[0]} | {row[1]} | Nullable: {row[2]} | Default: {row[3]}")
        
        # Check constraints on votes table
        print("\n=== VOTES TABLE CONSTRAINTS ===")
        cur.execute("""
            SELECT constraint_name, constraint_type
            FROM information_schema.table_constraints 
            WHERE table_name = 'votes';
        """)
        for row in cur.fetchall():
            print(f"  {row[0]} | {row[1]}")
        
        # Check foreign key relationships
        print("\n=== FOREIGN KEY RELATIONSHIPS ===")
        cur.execute("""
            SELECT 
                tc.constraint_name, 
                tc.table_name, 
                kcu.column_name, 
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name 
            FROM information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND tc.table_name = 'votes';
        """)
        for row in cur.fetchall():
            print(f"  {row[0]}: {row[1]}.{row[2]} -> {row[3]}.{row[4]}")
        
        # Check actual data in polling stations
        print("\n=== CURRENT POLLING STATIONS ===")
        cur.execute("SELECT id, name, constituencyid FROM pollingstations ORDER BY id;")
        stations = cur.fetchall()
        for station in stations:
            print(f"  ID: {station[0]} | Name: {station[1]} | Constituency: {station[2]}")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    check_table_structure()
