#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sample Data Population Script for Election Management System
This script populates the database with realistic sample data for testing and demonstration
"""

import psycopg2
from psycopg2 import sql
import bcrypt
import random
from datetime import datetime

def hash_password(password):
    """Hash a password for storing in the database"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def populate_sample_data():
    """Populate the database with comprehensive sample data"""
    
    conn = None
    try:
        # Connect to the database
        conn = psycopg2.connect(
            dbname="election_management",
            user="postgres",
            password="Mounish@123",
            host="localhost",
            port="5432"
        )
        cur = conn.cursor()
        
        print("🚀 Starting database population with sample data...")
        
        # Clear existing data (in correct order to respect foreign keys)
        print("🧹 Clearing existing data...")
        clear_commands = [
            "DELETE FROM Votes;",
            "DELETE FROM Candidates;", 
            "DELETE FROM Electors;",
            "DELETE FROM Officers;",
            "DELETE FROM PollingStations;",
            "DELETE FROM Parties;",
            "DELETE FROM Constituencies;",
            "DELETE FROM Users;"
        ]
        
        for cmd in clear_commands:
            cur.execute(cmd)
        
        # Reset sequences
        reset_sequences = [
            "ALTER SEQUENCE constituencies_id_seq RESTART WITH 1;",
            "ALTER SEQUENCE parties_id_seq RESTART WITH 1;",
            "ALTER SEQUENCE politicalparties_id_seq RESTART WITH 1;",
            "ALTER SEQUENCE pollingstations_id_seq RESTART WITH 1;",
            "ALTER SEQUENCE officers_id_seq RESTART WITH 1;",
            "ALTER SEQUENCE electors_id_seq RESTART WITH 1;",
            "ALTER SEQUENCE candidates_id_seq RESTART WITH 1;",
            "ALTER SEQUENCE users_id_seq RESTART WITH 1;"
        ]
        
        for cmd in reset_sequences:
            try:
                cur.execute(cmd)
            except:
                pass  # Some sequences might not exist
        
        # 1. Insert Constituencies
        print("🏛️ Inserting constituencies...")
        constituencies_data = [
            ("Northern District",),
            ("Southern District",),
            ("Eastern District",),
            ("Western District",),
            ("Central District",),
            ("Riverside District",)
        ]
        
        cur.executemany(
            "INSERT INTO Constituencies (name) VALUES (%s)",
            constituencies_data
        )
        
        # 2. Insert Political Parties
        print("🎯 Inserting political parties...")
        parties_data = [
            ("Progressive Party",),
            ("Conservative Alliance",),
            ("Liberty Union",),
            ("Green Future",),
            ("People's Democratic Party",),
            ("Independent Movement",)
        ]
        
        cur.executemany(
            "INSERT INTO Parties (name) VALUES (%s)",
            parties_data
        )
        
        # 3. Insert Polling Stations
        print("🏢 Inserting polling stations...")
        polling_stations_data = [
            # Northern District (ID: 1)
            ("North Community Center", "Downtown North", "Ward 1", 1),
            ("Northern Public School", "Suburb North", "Ward 2", 1),
            ("North Municipal Hall", "North Heights", "Ward 3", 1),
            ("Northside Library", "North Park", "Ward 4", 1),
            ("North Sports Complex", "North Valley", "Ward 5", 1),
            
            # Southern District (ID: 2)
            ("South Community Center", "Downtown South", "Ward 6", 2),
            ("Southern High School", "South Hills", "Ward 7", 2),
            ("South Civic Center", "South Bay", "Ward 8", 2),
            ("Southern Library", "South Gardens", "Ward 9", 2),
            ("South Recreation Center", "South Plaza", "Ward 10", 2),
            
            # Eastern District (ID: 3)
            ("East Community Hall", "East Side", "Ward 11", 3),
            ("Eastern Elementary", "East Park", "Ward 12", 3),
            ("East Municipal Building", "East Ridge", "Ward 13", 3),
            ("Eastern Cultural Center", "East Village", "Ward 14", 3),
            
            # Western District (ID: 4)
            ("West Community Center", "West End", "Ward 15", 4),
            ("Western Middle School", "West Hills", "Ward 16", 4),
            ("West Town Hall", "West Gate", "Ward 17", 4),
            ("Western Sports Club", "West Shore", "Ward 18", 4),
            ("West Public Library", "West Point", "Ward 19", 4),
            
            # Central District (ID: 5)
            ("Central Convention Center", "City Center", "Ward 20", 5),
            ("Central High School", "Central Plaza", "Ward 21", 5),
            ("City Hall", "Government District", "Ward 22", 5),
            ("Central Library", "Academic Quarter", "Ward 23", 5),
            ("Central Community Center", "Business District", "Ward 24", 5),
            ("Central Sports Arena", "Entertainment District", "Ward 25", 5),
            
            # Riverside District (ID: 6)
            ("Riverside Community Center", "River View", "Ward 26", 6),
            ("Riverside Elementary", "River Banks", "Ward 27", 6),
            ("Riverside Recreation Center", "River Side", "Ward 28", 6),
        ]
        
        cur.executemany(
            "INSERT INTO PollingStations (name, area, ward, constituencyId) VALUES (%s, %s, %s, %s)",
            polling_stations_data
        )
        
        # 4. Insert Officers
        print("👮 Inserting officers...")
        officers_data = [
            # Returning Officers (one per constituency)
            ("Mr. James Anderson", "returning", 1),
            ("Ms. Sarah Johnson", "returning", 6),
            ("Dr. Michael Chen", "returning", 11),
            ("Ms. Emily Davis", "returning", 16),
            ("Mr. Robert Wilson", "returning", 21),
            ("Ms. Linda Garcia", "returning", 26),
            
            # Registration Officers
            ("Mr. David Brown", "registration", 2),
            ("Ms. Jennifer Lee", "registration", 7),
            ("Mr. Thomas Miller", "registration", 12),
            ("Ms. Maria Martinez", "registration", 17),
            ("Mr. Christopher Taylor", "registration", 22),
            
            # Polling Officers (multiple per station)
            ("Ms. Amanda White", "polling", 1),
            ("Mr. Kevin Clark", "polling", 2),
            ("Ms. Michelle Rodriguez", "polling", 3),
            ("Mr. Daniel Lopez", "polling", 4),
            ("Ms. Nicole Harris", "polling", 5),
            ("Mr. Ryan Thompson", "polling", 6),
            ("Ms. Stephanie Moore", "polling", 7),
            ("Mr. Brandon Jackson", "polling", 8),
            
            # Presiding Officers (one per station)
            ("Mr. Mark Williams", "presiding", 1),
            ("Ms. Patricia Jones", "presiding", 2),
            ("Mr. John Smith", "presiding", 3),
            ("Ms. Lisa Anderson", "presiding", 4),
            ("Mr. Paul Johnson", "presiding", 5),
            ("Ms. Karen Wilson", "presiding", 6),
            ("Mr. Steven Davis", "presiding", 7),
            ("Ms. Nancy Brown", "presiding", 8),
            ("Mr. Charles Miller", "presiding", 9),
            ("Ms. Helen Garcia", "presiding", 10),
        ]
        
        cur.executemany(
            "INSERT INTO Officers (name, role, pollingStationId) VALUES (%s, %s, %s)",
            officers_data
        )
        
        # 5. Insert Candidates
        print("🗳️ Inserting candidates...")
        candidates_data = [
            # Northern District Candidates
            ("John Smith", 1, 1),  # Progressive Party
            ("Emma Johnson", 2, 1),  # Conservative Alliance
            ("Michael Brown", 3, 1),  # Liberty Union
            ("Sarah Wilson", 4, 1),  # Green Future
            
            # Southern District Candidates
            ("David Lee", 1, 2),  # Progressive Party
            ("Lisa Chen", 2, 2),  # Conservative Alliance
            ("Robert Garcia", 3, 2),  # Liberty Union
            ("Jennifer Kim", 4, 2),  # Green Future
            
            # Eastern District Candidates
            ("Thomas Parker", 1, 3),  # Progressive Party
            ("Maria Rodriguez", 2, 3),  # Conservative Alliance
            ("Anthony Davis", 3, 3),  # Liberty Union
            
            # Western District Candidates
            ("James Wilson", 1, 4),  # Progressive Party
            ("Elizabeth Taylor", 3, 4),  # Liberty Union
            ("William Johnson", 4, 4),  # Green Future
            
            # Central District Candidates
            ("Charles Martin", 2, 5),  # Conservative Alliance
            ("Patricia Adams", 1, 5),  # Progressive Party
            ("Daniel Wright", 4, 5),  # Green Future
            ("Michelle Thompson", 5, 5),  # People's Democratic Party
            
            # Riverside District Candidates
            ("Richard Martinez", 1, 6),  # Progressive Party
            ("Susan Clark", 2, 6),  # Conservative Alliance
            ("Alexander Wong", 6, 6),  # Independent Movement
        ]
        
        cur.executemany(
            "INSERT INTO Candidates (name, partyId, constituencyId) VALUES (%s, %s, %s)",
            candidates_data
        )
        
        # 6. Insert Electors (Voters)
        print("👥 Inserting electors...")
        elector_names = [
            "Alice Anderson", "Bob Baker", "Carol Carter", "Daniel Davis", "Eva Evans",
            "Frank Foster", "Grace Green", "Henry Harris", "Irene Ingram", "Jack Johnson",
            "Kate Kelly", "Larry Lewis", "Mary Miller", "Nancy Nelson", "Oliver O'Connor",
            "Patricia Parker", "Quinn Roberts", "Rachel Rodriguez", "Samuel Smith", "Tanya Taylor",
            "Ursula Underwood", "Victor Vargas", "Wendy Williams", "Xavier Xavier", "Yvonne Young",
            "Zachary Zhang", "Amanda Adams", "Brian Brown", "Cynthia Clark", "Douglas Davis",
            "Elizabeth Evans", "Frederick Foster", "Gloria Garcia", "Howard Hughes", "Isabella Ivan",
            "Jonathan Jones", "Katherine King", "Lawrence Lewis", "Margaret Miller", "Nicholas Nelson",
            "Olivia O'Neal", "Peter Parker", "Rebecca Rodriguez", "Stephen Smith", "Teresa Taylor",
            "Vincent Vance", "Wanda White", "Marcus Martinez", "Linda Lopez", "George Garcia",
            "Diane Davis", "Charles Chen", "Betty Brown", "Anthony Anderson", "Dorothy Davis"
        ]
        
        electors_data = []
        for i, name in enumerate(elector_names, 1):
            # Distribute electors across polling stations
            station_id = ((i - 1) % 28) + 1
            serial_number = f"EL{i:04d}"
            electors_data.append((serial_number, name, station_id))
        
        # Add more electors to reach realistic numbers
        base_electors = len(electors_data)
        for i in range(base_electors + 1, 501):  # Add up to 500 electors total
            station_id = ((i - 1) % 28) + 1
            serial_number = f"EL{i:04d}"
            name = f"Voter {i:03d}"
            electors_data.append((serial_number, name, station_id))
        
        cur.executemany(
            "INSERT INTO Electors (serialNumber, name, pollingStationId) VALUES (%s, %s, %s)",
            electors_data
        )
        
        # 7. Insert Votes (realistic distribution)
        print("🗳️ Inserting votes...")
        
        # Get all candidates and their constituencies
        cur.execute("""
            SELECT c.id, c.constituencyId, p.name as partyName 
            FROM Candidates c 
            LEFT JOIN Parties p ON c.partyId = p.id
        """)
        candidates_info = cur.fetchall()
        
        # Get all electors
        cur.execute("SELECT serialNumber, pollingStationId FROM Electors")
        all_electors = cur.fetchall()
        
        # Create realistic voting patterns
        votes_data = []
        
        # Simulate 75% turnout
        voting_electors = random.sample(all_electors, int(len(all_electors) * 0.75))
        
        for elector_serial, polling_station_id in voting_electors:
            # Get constituency for this polling station
            cur.execute("SELECT constituencyId FROM PollingStations WHERE id = %s", (polling_station_id,))
            constituency_result = cur.fetchone()
            if constituency_result:
                constituency_id = constituency_result[0]
                
                # Get candidates for this constituency
                constituency_candidates = [c for c in candidates_info if c[1] == constituency_id]
                
                if constituency_candidates:
                    # Weight votes based on party (Progressive Party slightly favored)
                    weights = []
                    for candidate_id, _, party_name in constituency_candidates:
                        if party_name == "Progressive Party":
                            weights.append(0.35)
                        elif party_name == "Conservative Alliance":
                            weights.append(0.30)
                        elif party_name == "Liberty Union":
                            weights.append(0.20)
                        elif party_name == "Green Future":
                            weights.append(0.10)
                        else:
                            weights.append(0.05)
                    
                    # Normalize weights
                    total_weight = sum(weights)
                    if total_weight > 0:
                        weights = [w/total_weight for w in weights]
                        
                        # Select candidate based on weights
                        selected_candidate = random.choices(constituency_candidates, weights=weights)[0]
                        votes_data.append((elector_serial, selected_candidate[0]))
        
        if votes_data:
            cur.executemany(
                "INSERT INTO Votes (electorSerialNumber, candidateId) VALUES (%s, %s)",
                votes_data
            )
        
        # 8. Create Users table if it doesn't exist (for authentication)
        print("👤 Creating users...")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS Users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) CHECK (role IN ('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer', 'elector')) NOT NULL,
                linkedId INTEGER,
                email VARCHAR(255) NOT NULL
            )
        """)
        
        # Insert sample users
        users_data = [
            # Admin users
            ("admin", hash_password("admin123"), "admin", None, "admin@election.gov"),
            ("superadmin", hash_password("super123"), "admin", None, "superadmin@election.gov"),
            
            # Returning Officers
            ("ro_anderson", hash_password("ro123"), "returning_officer", 1, "j.anderson@election.gov"),
            ("ro_johnson", hash_password("ro123"), "returning_officer", 2, "s.johnson@election.gov"),
            
            # Registration Officers  
            ("reg_brown", hash_password("reg123"), "registration_officer", 7, "d.brown@election.gov"),
            ("reg_lee", hash_password("reg123"), "registration_officer", 8, "j.lee@election.gov"),
            
            # Polling Officers
            ("poll_white", hash_password("poll123"), "polling_officer", 13, "a.white@election.gov"),
            ("poll_clark", hash_password("poll123"), "polling_officer", 14, "k.clark@election.gov"),
            
            # Presiding Officers
            ("pres_williams", hash_password("pres123"), "presiding_officer", 19, "m.williams@election.gov"),
            ("pres_jones", hash_password("pres123"), "presiding_officer", 20, "p.jones@election.gov"),
            
            # Sample Electors
            ("elector1", hash_password("vote123"), "elector", None, "alice.anderson@email.com"),
            ("elector2", hash_password("vote123"), "elector", None, "bob.baker@email.com"),
            ("elector3", hash_password("vote123"), "elector", None, "carol.carter@email.com"),
            ("voter123", hash_password("voter123"), "elector", None, "voter@email.com"),
        ]
        
        cur.executemany(
            "INSERT INTO Users (username, password, role, linkedId, email) VALUES (%s, %s, %s, %s, %s)",
            users_data
        )
        
        # Link electors to users (update linkedId for elector users)
        cur.execute("UPDATE Users SET linkedId = (SELECT id FROM Electors WHERE serialNumber = 'EL0001') WHERE username = 'elector1'")
        cur.execute("UPDATE Users SET linkedId = (SELECT id FROM Electors WHERE serialNumber = 'EL0002') WHERE username = 'elector2'")
        cur.execute("UPDATE Users SET linkedId = (SELECT id FROM Electors WHERE serialNumber = 'EL0003') WHERE username = 'elector3'")
        cur.execute("UPDATE Users SET linkedId = (SELECT id FROM Electors WHERE serialNumber = 'EL0001') WHERE username = 'voter123'")
        
        # Commit all changes
        conn.commit()
        
        # Print summary statistics
        print("\n" + "="*60)
        print("📊 DATABASE POPULATION SUMMARY")
        print("="*60)
        
        tables_stats = [
            ("Constituencies", "SELECT COUNT(*) FROM Constituencies"),
            ("Parties", "SELECT COUNT(*) FROM Parties"),
            ("Polling Stations", "SELECT COUNT(*) FROM PollingStations"),
            ("Officers", "SELECT COUNT(*) FROM Officers"),
            ("Candidates", "SELECT COUNT(*) FROM Candidates"),
            ("Electors", "SELECT COUNT(*) FROM Electors"),
            ("Votes", "SELECT COUNT(*) FROM Votes"),
            ("Users", "SELECT COUNT(*) FROM Users")
        ]
        
        for table_name, query in tables_stats:
            cur.execute(query)
            count = cur.fetchone()[0]
            print(f"{table_name:20}: {count:6} records")
        
        # Calculate and display turnout
        cur.execute("SELECT COUNT(*) FROM Electors")
        total_electors = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM Votes")
        total_votes = cur.fetchone()[0]
        turnout = (total_votes / total_electors) * 100 if total_electors > 0 else 0
        
        print(f"\n📈 Voter Turnout: {turnout:.1f}% ({total_votes}/{total_electors})")
        
        # Show candidate vote counts
        print(f"\n🗳️ CANDIDATE VOTE COUNTS:")
        print("-" * 60)
        
        cur.execute("""
            SELECT 
                c.name,
                p.name as party,
                const.name as constituency,
                COUNT(v.candidateId) as vote_count
            FROM Candidates c
            LEFT JOIN Parties p ON c.partyId = p.id
            LEFT JOIN Constituencies const ON c.constituencyId = const.id
            LEFT JOIN Votes v ON c.id = v.candidateId
            GROUP BY c.id, c.name, p.name, const.name
            ORDER BY const.name, COUNT(v.candidateId) DESC
        """)
        
        results = cur.fetchall()
        current_constituency = None
        
        for candidate_name, party_name, constituency_name, vote_count in results:
            if constituency_name != current_constituency:
                print(f"\n{constituency_name}:")
                current_constituency = constituency_name
            
            party_display = party_name if party_name else "Independent"
            print(f"  {candidate_name:20} ({party_display:20}): {vote_count:4} votes")
        
        print(f"\n✅ Sample data population completed successfully!")
        print(f"📱 You can now log in with any of these test accounts:")
        print(f"   Admin: admin/admin123")
        print(f"   Elector: voter123/voter123")
        print(f"   Officer: ro_anderson/ro123")
        
        cur.close()
        
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"❌ Error occurred: {error}")
        if conn:
            conn.rollback()
    finally:
        if conn is not None:
            conn.close()

if __name__ == '__main__':
    populate_sample_data()
