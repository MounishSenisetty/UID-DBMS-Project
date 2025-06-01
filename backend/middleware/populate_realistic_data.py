import psycopg2
import psycopg2.errors
import bcrypt
from datetime import datetime, timedelta
import random

def connect_db():
    """Connect to PostgreSQL database"""
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="election_database",  # Use correct database name from .env
            user="postgres",
            password="Mounish@123"
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

def clear_existing_data(cursor):
    """Safely clear existing data while respecting foreign key constraints"""
    print("Clearing existing data... (ignoring missing tables)")
    tables = ['electionresults', 'votes', 'electors', 'officers', 'candidates', 'pollingstations', 'parties', 'constituencies']
    for tbl in tables:
        try:
            cursor.execute(f"DELETE FROM {tbl};")
            print(f"Cleared table {tbl}")
        except Exception as e:
            print(f"Skipping table {tbl}: {e}")
    # Keep admin users only
    try:
        cursor.execute("DELETE FROM users WHERE role != 'admin';")
        print("Cleared non-admin users")
    except Exception as e:
        print(f"Skipping users cleanup: {e}")
    print("Finished clearing existing data")

def populate_constituencies(cursor):
    """Populate constituencies table"""
    constituencies = [
        ('Northern District', 'Karnataka', 'Bangalore', 'ND-001', 'Urban area with high population density covering north Bangalore'),
        ('Southern District', 'Karnataka', 'Bangalore', 'SD-001', 'Mixed urban-rural constituency in south Bangalore'),
        ('Eastern District', 'Karnataka', 'Bangalore', 'ED-001', 'Industrial and commercial hub in east Bangalore'),
        ('Western District', 'Karnataka', 'Bangalore', 'WD-001', 'IT corridor and residential areas in west Bangalore'),
        ('Central District', 'Karnataka', 'Bangalore', 'CD-001', 'Government and business center in central Bangalore'),
        ('Riverside District', 'Karnataka', 'Bangalore', 'RD-001', 'Riverside areas with mixed development along Kaveri')
    ]
    
    constituency_ids = []
    
    for name, state, district, code, description in constituencies:
        cursor.execute("""
            INSERT INTO constituencies (name, state, district, code, description)
            VALUES (%s, %s, %s, %s, %s) RETURNING id
        """, (name, state, district, code, description))
        constituency_id = cursor.fetchone()[0]
        constituency_ids.append((constituency_id, name, code))
    
    print(f"Inserted {len(constituencies)} constituencies")
    return constituency_ids

def populate_parties(cursor):
    """Populate parties table"""
    parties = [
        ('Progressive Party', '🔵'),
        ('Conservative Alliance', '🔴'),
        ('Liberty Union', '🟡'),
        ('Green Future', '🟢'),
        ('People\'s Democratic Party', '🟣'),
        ('Independent Movement', '⚪')
    ]
    
    party_ids = []
    
    for name, symbol in parties:
        cursor.execute("""
            INSERT INTO parties (name, symbol) VALUES (%s, %s) RETURNING id
        """, (name, symbol))
        party_id = cursor.fetchone()[0]
        party_ids.append((party_id, name))
    
    print(f"Inserted {len(parties)} parties")
    return party_ids

def populate_polling_stations(cursor, constituency_ids):
    """Populate polling stations table"""
    stations_data = [
        # Northern District
        ('Community Center North', 'Hebbal', 'Ward 1'),
        ('North High School', 'Yelahanka', 'Ward 2'),
        ('City Hall North', 'Sanjaynagar', 'Ward 3'),
        ('Library Branch North', 'RT Nagar', 'Ward 4'),
        ('North Recreation Center', 'Mathikere', 'Ward 5'),
        
        # Southern District
        ('South Elementary School', 'Jayanagar', 'Ward 6'),
        ('Community Hall South', 'BTM Layout', 'Ward 7'),
        ('South Fire Station', 'JP Nagar', 'Ward 8'),
        ('Rural Community Center', 'Banashankari', 'Ward 9'),
        ('South Sports Complex', 'Kumaraswamy Layout', 'Ward 10'),
        
        # Eastern District
        ('East Trade Center', 'Whitefield', 'Ward 11'),
        ('Industrial Complex Hall', 'KR Puram', 'Ward 12'),
        ('East High School', 'Marathahalli', 'Ward 13'),
        ('Technology Park Center', 'Bellandur', 'Ward 14'),
        ('East Community Center', 'HAL', 'Ward 15'),
        
        # Western District
        ('West Community Hall', 'Rajajinagar', 'Ward 16'),
        ('Business Center West', 'Vijayanagar', 'Ward 17'),
        ('West Elementary School', 'Basaveshwaranagar', 'Ward 18'),
        ('Innovation Hub Center', 'Peenya', 'Ward 19'),
        ('West Recreation Center', 'Nagarbhavi', 'Ward 20'),
        
        # Central District
        ('Central Government Building', 'Vidhana Soudha', 'Ward 21'),
        ('Downtown Conference Center', 'MG Road', 'Ward 22'),
        ('Central Library Main', 'Cubbon Park', 'Ward 23'),
        ('City Convention Center', 'UB City', 'Ward 24'),
        
        # Riverside District
        ('Riverside Community Hall', 'Koramangala', 'Ward 25'),
        ('Riverside School', 'Indiranagar', 'Ward 26'),
        ('Cultural Center', 'Domlur', 'Ward 27'),
        ('Sports Complex Riverside', 'Ejipura', 'Ward 28')
    ]
    
    station_ids = []
    stations_per_constituency = len(stations_data) // len(constituency_ids)
    
    for i, (const_id, const_name, const_code) in enumerate(constituency_ids):
        start_idx = i * stations_per_constituency
        end_idx = start_idx + stations_per_constituency
        
        # Handle remainder for last constituency
        if i == len(constituency_ids) - 1:
            end_idx = len(stations_data)
        
        for j in range(start_idx, end_idx):
            if j < len(stations_data):
                name, area, ward = stations_data[j]
                cursor.execute("""
                    INSERT INTO pollingstations (name, area, ward, constituencyid)
                    VALUES (%s, %s, %s, %s) RETURNING id
                """, (name, area, ward, const_id))
                station_id = cursor.fetchone()[0]
                station_ids.append((station_id, name, const_id))
    
    print(f"Inserted {len(station_ids)} polling stations")
    return station_ids

def populate_officers(cursor, constituency_ids, station_ids):
    """Populate officers table"""
    officer_names = [
        'Rajesh Kumar', 'Priya Sharma', 'Suresh Reddy', 'Anita Desai', 'Manoj Gupta',
        'Sunita Rao', 'Vikram Singh', 'Kavita Nair', 'Arun Joshi', 'Meera Iyer',
        'Deepak Mehta', 'Shweta Agarwal', 'Ravi Chandra', 'Pooja Mishra', 'Amit Verma',
        'Neha Kapoor', 'Sanjay Patil', 'Asha Bhatt', 'Kiran Kumar', 'Geeta Varma',
        'Rakesh Jain', 'Latha Srinivasan', 'Mahesh Gowda', 'Sapna Kulkarni', 'Praveen Raj',
        'Usha Hegde', 'Girish Naik', 'Ritu Pandey', 'Mohan Das', 'Shubha Rao',
        'Prakash Shetty', 'Madhuri Joshi', 'Ramesh Babu', 'Chitra Menon', 'Satish Kumar'
    ]
    
    roles = ['returning', 'registration', 'polling', 'presiding']
    officer_count = 0
    
    # Assign officers to constituencies and stations
    for const_id, const_name, const_code in constituency_ids:
        # 1 returning officer per constituency
        cursor.execute("""
            INSERT INTO officers (name, role, pollingstationid) 
            VALUES (%s, %s, %s)
        """, (officer_names[officer_count % len(officer_names)], 'returning', None))
        officer_count += 1
        
        # 1 registration officer per constituency
        cursor.execute("""
            INSERT INTO officers (name, role, pollingstationid) 
            VALUES (%s, %s, %s)
        """, (officer_names[officer_count % len(officer_names)], 'registration', None))
        officer_count += 1
    
    # Assign polling and presiding officers to stations
    for station_id, station_name, station_const_id in station_ids:
        # 1 polling officer per station
        cursor.execute("""
            INSERT INTO officers (name, role, pollingstationid) 
            VALUES (%s, %s, %s)
        """, (officer_names[officer_count % len(officer_names)], 'polling', station_id))
        officer_count += 1
        
        # 1 presiding officer per station
        cursor.execute("""
            INSERT INTO officers (name, role, pollingstationid) 
            VALUES (%s, %s, %s)
        """, (officer_names[officer_count % len(officer_names)], 'presiding', station_id))
        officer_count += 1
    
    print(f"Inserted {officer_count} officers")

def populate_candidates(cursor, constituency_ids, party_ids):
    """Populate candidates table"""
    candidate_names = [
        'Dr. Arjun Prakash', 'Smita Malhotra', 'Rohit Gupta', 'Kavya Reddy', 'Ashwin Kumar',
        'Priyanka Singh', 'Varun Sharma', 'Nandini Rao', 'Ravi Agarwal', 'Shilpa Joshi',
        'Manoj Desai', 'Anjali Nair', 'Suresh Iyer', 'Deepika Mehta', 'Vikash Chandra',
        'Rashmi Kapoor', 'Abhishek Patil', 'Poornima Bhatt', 'Karthik Kumar', 'Neetu Varma',
        'Sandeep Jain', 'Lakshmi Srinivasan', 'Harish Gowda', 'Suma Kulkarni', 'Pavan Raj'
    ]
    
    candidate_count = 0
    
    for const_id, const_name, const_code in constituency_ids:
        # 3-4 candidates per constituency from different parties
        num_candidates = random.randint(3, 4)
        selected_parties = random.sample(party_ids, num_candidates)
        
        for party_id, party_name in selected_parties:
            candidate_name = candidate_names[candidate_count % len(candidate_names)]
            cursor.execute("""
                INSERT INTO candidates (name, partyid, constituencyid, status)
                VALUES (%s, %s, %s, %s)
            """, (candidate_name, party_id, const_id, 'approved'))
            candidate_count += 1
    
    print(f"Inserted {candidate_count} candidates")

def populate_electors(cursor, station_ids):
    """Populate electors table with realistic serial numbers"""
    first_names = [
        'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
        'Aadhya', 'Saanvi', 'Anaya', 'Diya', 'Pihu', 'Prisha', 'Inaya', 'Kavya', 'Anika', 'Riya',
        'Rajesh', 'Suresh', 'Ramesh', 'Mahesh', 'Dinesh', 'Naresh', 'Mukesh', 'Ritesh', 'Ganesh', 'Yogesh',
        'Priya', 'Pooja', 'Neha', 'Shreya', 'Deepika', 'Anita', 'Kavita', 'Sunita', 'Geeta', 'Meera',
        'Amit', 'Rohit', 'Sumit', 'Vinit', 'Lalit', 'Anil', 'Sunil', 'Kapil', 'Nitin', 'Varun',
        'Sneha', 'Rekha', 'Seema', 'Reema', 'Hema', 'Sushma', 'Nisha', 'Asha', 'Usha', 'Radha'
    ]
    
    last_names = [
        'Sharma', 'Gupta', 'Singh', 'Kumar', 'Verma', 'Agarwal', 'Jain', 'Bansal', 'Garg', 'Mittal',
        'Rao', 'Reddy', 'Nair', 'Iyer', 'Menon', 'Pillai', 'Krishnan', 'Subramaniam', 'Raman', 'Swamy',
        'Patil', 'Desai', 'Shah', 'Mehta', 'Joshi', 'Patel', 'Pandya', 'Parikh', 'Trivedi', 'Vora',
        'Das', 'Roy', 'Sen', 'Ghosh', 'Banerjee', 'Mukherjee', 'Chakraborty', 'Bhattacharya', 'Sarkar', 'Bose'
    ]
    
    elector_count = 0
    
    for station_id, station_name, const_id in station_ids:
        # Generate 15-25 electors per station
        num_electors = random.randint(15, 25)
        
        for i in range(num_electors):
            # Generate realistic serial number: Station-based format
            serial_number = f"EL{station_id:02d}{(i+1):04d}"  # EL01001, EL01002, etc.
            
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            full_name = f"{first_name} {last_name}"
            
            cursor.execute("""
                INSERT INTO electors (serialnumber, name, pollingstationid)
                VALUES (%s, %s, %s)
            """, (serial_number, full_name, station_id))
            
            elector_count += 1
    
    print(f"Inserted {elector_count} electors")

def simulate_voting(cursor):
    """Simulate realistic voting patterns"""
    print("Simulating voting...")
    
    # Get all electors
    cursor.execute("SELECT serialnumber, pollingstationid FROM electors")
    electors = cursor.fetchall()
    
    # Get all candidates with their constituency info
    cursor.execute("""
        SELECT c.id, c.constituencyid, ps.constituencyid as station_const
        FROM candidates c
        JOIN pollingstations ps ON ps.constituencyid = c.constituencyid
        GROUP BY c.id, c.constituencyid, ps.constituencyid
    """)
    candidates = cursor.fetchall()
    
    # Create mapping of constituencies to candidates
    const_to_candidates = {}
    for cand_id, cand_const, station_const in candidates:
        if cand_const not in const_to_candidates:
            const_to_candidates[cand_const] = []
        const_to_candidates[cand_const].append(cand_id)
    
    # Simulate 70-80% voter turnout
    voting_electors = random.sample(electors, int(len(electors) * random.uniform(0.70, 0.80)))
    
    for elector_serial, station_id in voting_electors:
        # Get constituency for this station
        cursor.execute("SELECT constituencyid FROM pollingstations WHERE id = %s", (station_id,))
        result = cursor.fetchone()
        if not result:
            continue
            
        constituency_id = result[0]
        
        if constituency_id in const_to_candidates:
            # Select a random candidate from this constituency
            candidate_id = random.choice(const_to_candidates[constituency_id])
            
            try:
                cursor.execute("""
                    INSERT INTO votes (electorserialnumber, candidateid, pollingstationid)
                    VALUES (%s, %s, %s)
                """, (elector_serial, candidate_id, station_id))
            except Exception as e:
                # Skip if already voted (duplicate)
                continue
    
    # Update election results table
    cursor.execute("""
        INSERT INTO electionresults (pollingstationid, candidateid, votescount)
        SELECT pollingstationid, candidateid, COUNT(*) as vote_count
        FROM votes
        GROUP BY pollingstationid, candidateid
    """)
    
    print(f"Simulated voting for {len(voting_electors)} electors")

def create_user_accounts(cursor, constituency_ids, station_ids):
    """Create user accounts for different roles"""
    
    # Admin user (if not exists)
    admin_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    cursor.execute("""
        INSERT INTO users (username, password, role, email)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (username) DO NOTHING
    """, ("admin", admin_password, "admin", "admin@election.gov"))
    
    # Create elector accounts (sample)
    cursor.execute("SELECT serialnumber, name FROM electors LIMIT 10")
    sample_electors = cursor.fetchall()
    
    for serial_number, name in sample_electors:
        username = f"elector_{serial_number.lower()}"
        password = bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        email = f"{username}@election.voter"
        
        # Convert serial number to integer for linkedId (remove EL prefix and use numeric part)
        try:
            linked_id = int(serial_number.replace('EL', ''))
        except:
            linked_id = None
        
        cursor.execute("""
            INSERT INTO users (username, password, role, linkedid, email)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (username) DO NOTHING
        """, (username, password, "elector", linked_id, email))
    
    # Create officer accounts (sample)
    cursor.execute("SELECT id, name, role FROM officers LIMIT 5")
    sample_officers = cursor.fetchall()
    
    for officer_id, name, role in sample_officers:
        username = f"{role}_{officer_id}"
        password = bcrypt.hashpw("officer123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        email = f"{username}@election.gov"
        
        cursor.execute("""
            INSERT INTO users (username, password, role, linkedid, email)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (username) DO NOTHING
        """, (username, password, f"{role}_officer", officer_id, email))
    
    print("Created user accounts for different roles")

def main():
    """Main function to populate all data"""
    conn = connect_db()
    if not conn:
        return
    
    try:
        cursor = conn.cursor()
        
        # Clear existing data
        clear_existing_data(cursor)
        
        # Populate data in correct order
        constituency_ids = populate_constituencies(cursor)
        party_ids = populate_parties(cursor)
        station_ids = populate_polling_stations(cursor, constituency_ids)
        populate_officers(cursor, constituency_ids, station_ids)
        populate_candidates(cursor, constituency_ids, party_ids)
        populate_electors(cursor, station_ids)
        simulate_voting(cursor)
        create_user_accounts(cursor, constituency_ids, station_ids)
        
        # Commit all changes
        conn.commit()
        print("\n✅ All sample data populated successfully!")
        
        # Print summary
        cursor.execute("SELECT COUNT(*) FROM constituencies")
        const_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM parties")
        party_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM pollingstations")
        station_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM candidates")
        candidate_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM electors")
        elector_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM votes")
        vote_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        
        print(f"\n📊 DATABASE SUMMARY:")
        print(f"   Constituencies: {const_count}")
        print(f"   Political Parties: {party_count}")
        print(f"   Polling Stations: {station_count}")
        print(f"   Candidates: {candidate_count}")
        print(f"   Electors: {elector_count}")
        print(f"   Votes Cast: {vote_count}")
        print(f"   User Accounts: {user_count}")
        print(f"   Voter Turnout: {(vote_count/elector_count)*100:.1f}%")
        
    except Exception as e:
        print(f"❌ Error during population: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    main()
