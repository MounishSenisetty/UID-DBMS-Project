import psycopg2
import bcrypt
from datetime import datetime, timedelta
import random

def connect_db():
    """Connect to PostgreSQL database"""
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="election_management",
            user="postgres",
            password="Mounish@123"
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

def clear_existing_data(cursor):
    """Safely clear existing data while respecting foreign key constraints"""
    try:
        # Delete in order of dependencies to avoid foreign key violations
        print("Clearing existing data...")
        
        # First clear tables that reference others
        cursor.execute("DELETE FROM electionresults;")
        cursor.execute("DELETE FROM votes;")
        cursor.execute("DELETE FROM electors;")
        cursor.execute("DELETE FROM officers;")
        cursor.execute("DELETE FROM candidates;")
        cursor.execute("DELETE FROM pollingstations;")
        cursor.execute("DELETE FROM parties;")
        cursor.execute("DELETE FROM constituencies;")
        cursor.execute("DELETE FROM users;")
        
        print("Existing data cleared successfully")
        
    except Exception as e:
        print(f"Error clearing data: {e}")
        raise

def populate_constituencies(cursor):
    """Populate constituencies table"""
    constituencies = [
        ('CONST001', 'Northern District', 'Urban area with high population density'),
        ('CONST002', 'Southern District', 'Mixed urban-rural constituency'),
        ('CONST003', 'Eastern District', 'Industrial and commercial hub'),
        ('CONST004', 'Western District', 'Coastal region with fishing communities'),
        ('CONST005', 'Central District', 'Government and business center'),
        ('CONST006', 'Riverside District', 'Agricultural area along the river')
    ]
    
    for const_id, name, description in constituencies:
        cursor.execute("""
            INSERT INTO constituencies (constituency_id, constituency_name, description)
            VALUES (%s, %s, %s)
        """, (const_id, name, description))
    
    print(f"Inserted {len(constituencies)} constituencies")

def populate_parties(cursor):
    """Populate parties table"""
    parties = [
        ('PP', 'Progressive Party', '🔵', 'Center-left progressive policies'),
        ('CA', 'Conservative Alliance', '🔴', 'Traditional conservative values'),
        ('LU', 'Liberty Union', '🟡', 'Libertarian and individual rights focus'),
        ('GF', 'Green Future', '🟢', 'Environmental and sustainability focus'),
        ('PDP', 'People\'s Democratic Party', '🟣', 'Social democratic platform'),
        ('IND', 'Independent Movement', '⚪', 'Non-partisan independent candidates')
    ]
    
    for party_id, name, symbol, description in parties:
        cursor.execute("""
            INSERT INTO parties (party_id, party_name, symbol, description)
            VALUES (%s, %s, %s, %s)
        """, (party_id, name, symbol, description))
    
    print(f"Inserted {len(parties)} parties")

def populate_polling_stations(cursor):
    """Populate polling stations table"""
    stations = [
        # Northern District
        ('PS001', 'CONST001', 'Community Center North', '123 Main St', 500),
        ('PS002', 'CONST001', 'North High School', '456 Oak Ave', 750),
        ('PS003', 'CONST001', 'City Hall North', '789 Pine Rd', 600),
        ('PS004', 'CONST001', 'Library Branch North', '321 Elm St', 400),
        ('PS005', 'CONST001', 'North Recreation Center', '654 Maple Dr', 550),
        
        # Southern District
        ('PS006', 'CONST002', 'South Elementary School', '111 South St', 450),
        ('PS007', 'CONST002', 'Community Hall South', '222 Valley Rd', 525),
        ('PS008', 'CONST002', 'South Fire Station', '333 Hill Ave', 375),
        ('PS009', 'CONST002', 'Rural Community Center', '444 Country Ln', 300),
        ('PS010', 'CONST002', 'South Sports Complex', '555 Stadium Dr', 650),
        
        # Eastern District
        ('PS011', 'CONST003', 'East Trade Center', '777 Commerce St', 700),
        ('PS012', 'CONST003', 'Industrial Complex Hall', '888 Factory Rd', 800),
        ('PS013', 'CONST003', 'East High School', '999 Education Blvd', 650),
        ('PS014', 'CONST003', 'Technology Park Center', '101 Tech Ave', 500),
        ('PS015', 'CONST003', 'East Community Center', '202 Unity St', 425),
        
        # Western District
        ('PS016', 'CONST004', 'Coastal Community Hall', '303 Beach Rd', 400),
        ('PS017', 'CONST004', 'Harbor View Center', '404 Port St', 350),
        ('PS018', 'CONST004', 'West Elementary School', '505 Sunset Ave', 475),
        ('PS019', 'CONST004', 'Fishing Village Hall', '606 Marina Dr', 275),
        ('PS020', 'CONST004', 'West Recreation Center', '707 Ocean Blvd', 525),
        
        # Central District
        ('PS021', 'CONST005', 'Central Government Building', '808 Capitol St', 900),
        ('PS022', 'CONST005', 'Downtown Conference Center', '909 Business Ave', 750),
        ('PS023', 'CONST005', 'Central Library Main', '010 Knowledge St', 650),
        ('PS024', 'CONST005', 'City Convention Center', '121 Event Blvd', 800),
        
        # Riverside District
        ('PS025', 'CONST006', 'Riverside Community Hall', '232 River Rd', 450),
        ('PS026', 'CONST006', 'Agricultural Center', '343 Farm St', 350),
        ('PS027', 'CONST006', 'Riverside School', '454 Education Dr', 400),
        ('PS028', 'CONST006', 'Rural Fire Station', '565 Safety Ave', 300)
    ]
    
    for station_id, const_id, name, address, capacity in stations:
        cursor.execute("""
            INSERT INTO pollingstations (polling_station_id, constituency_id, station_name, address, capacity)
            VALUES (%s, %s, %s, %s, %s)
        """, (station_id, const_id, name, address, capacity))
    
    print(f"Inserted {len(stations)} polling stations")

def populate_officers(cursor):
    """Populate officers table"""
    officers = [
        # Returning Officers (1 per constituency)
        ('RO001', 'John Smith', 'returning_officer', 'CONST001', '9876543210', 'john.smith@election.gov'),
        ('RO002', 'Sarah Johnson', 'returning_officer', 'CONST002', '9876543211', 'sarah.johnson@election.gov'),
        ('RO003', 'Michael Brown', 'returning_officer', 'CONST003', '9876543212', 'michael.brown@election.gov'),
        ('RO004', 'Emily Davis', 'returning_officer', 'CONST004', '9876543213', 'emily.davis@election.gov'),
        ('RO005', 'David Wilson', 'returning_officer', 'CONST005', '9876543214', 'david.wilson@election.gov'),
        ('RO006', 'Lisa Anderson', 'returning_officer', 'CONST006', '9876543215', 'lisa.anderson@election.gov'),
        
        # Registration Officers
        ('REG001', 'Robert Taylor', 'registration_officer', 'CONST001', '9876543220', 'robert.taylor@election.gov'),
        ('REG002', 'Jennifer White', 'registration_officer', 'CONST002', '9876543221', 'jennifer.white@election.gov'),
        ('REG003', 'Christopher Lee', 'registration_officer', 'CONST003', '9876543222', 'christopher.lee@election.gov'),
        ('REG004', 'Amanda Martinez', 'registration_officer', 'CONST004', '9876543223', 'amanda.martinez@election.gov'),
        ('REG005', 'Matthew Garcia', 'registration_officer', 'CONST005', '9876543224', 'matthew.garcia@election.gov'),
        ('REG006', 'Michelle Rodriguez', 'registration_officer', 'CONST006', '9876543225', 'michelle.rodriguez@election.gov'),
        
        # Polling Officers (selected stations)
        ('PO001', 'James Thompson', 'polling_officer', 'CONST001', '9876543230', 'james.thompson@election.gov'),
        ('PO002', 'Patricia Clark', 'polling_officer', 'CONST001', '9876543231', 'patricia.clark@election.gov'),
        ('PO003', 'Daniel Lewis', 'polling_officer', 'CONST002', '9876543232', 'daniel.lewis@election.gov'),
        ('PO004', 'Barbara Walker', 'polling_officer', 'CONST002', '9876543233', 'barbara.walker@election.gov'),
        ('PO005', 'Thomas Hall', 'polling_officer', 'CONST003', '9876543234', 'thomas.hall@election.gov'),
        ('PO006', 'Susan Allen', 'polling_officer', 'CONST003', '9876543235', 'susan.allen@election.gov'),
        ('PO007', 'Richard Young', 'polling_officer', 'CONST004', '9876543236', 'richard.young@election.gov'),
        ('PO008', 'Nancy King', 'polling_officer', 'CONST004', '9876543237', 'nancy.king@election.gov'),
        ('PO009', 'Charles Wright', 'polling_officer', 'CONST005', '9876543238', 'charles.wright@election.gov'),
        ('PO010', 'Helen Lopez', 'polling_officer', 'CONST005', '9876543239', 'helen.lopez@election.gov'),
        ('PO011', 'Paul Hill', 'polling_officer', 'CONST006', '9876543240', 'paul.hill@election.gov'),
        ('PO012', 'Karen Green', 'polling_officer', 'CONST006', '9876543241', 'karen.green@election.gov'),
        
        # Presiding Officers (selected stations)
        ('PRE001', 'Steven Adams', 'presiding_officer', 'CONST001', '9876543250', 'steven.adams@election.gov'),
        ('PRE002', 'Dorothy Baker', 'presiding_officer', 'CONST002', '9876543251', 'dorothy.baker@election.gov'),
        ('PRE003', 'Kenneth Nelson', 'presiding_officer', 'CONST003', '9876543252', 'kenneth.nelson@election.gov'),
        ('PRE004', 'Betty Carter', 'presiding_officer', 'CONST004', '9876543253', 'betty.carter@election.gov'),
        ('PRE005', 'Anthony Mitchell', 'presiding_officer', 'CONST005', '9876543254', 'anthony.mitchell@election.gov'),
        ('PRE006', 'Sandra Perez', 'presiding_officer', 'CONST006', '9876543255', 'sandra.perez@election.gov')
    ]
    
    for officer_id, name, role, const_id, phone, email in officers:
        cursor.execute("""
            INSERT INTO officers (officer_id, officer_name, role, constituency_id, phone_number, email)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (officer_id, name, role, const_id, phone, email))
    
    print(f"Inserted {len(officers)} officers")

def populate_candidates(cursor):
    """Populate candidates table"""
    candidates = [
        # Northern District (CONST001)
        ('CAND001', 'Alice Cooper', 'PP', 'CONST001', 32, 'Independent business owner and community activist'),
        ('CAND002', 'Bob Miller', 'CA', 'CONST001', 45, 'Former city council member and education advocate'),
        ('CAND003', 'Carol Green', 'LU', 'CONST001', 38, 'Environmental lawyer and policy expert'),
        ('CAND004', 'Daniel Ray', 'IND', 'CONST001', 52, 'Local business leader and community volunteer'),
        
        # Southern District (CONST002)
        ('CAND005', 'Eva Martinez', 'GF', 'CONST002', 41, 'Agricultural scientist and sustainability expert'),
        ('CAND006', 'Frank Wilson', 'PP', 'CONST002', 48, 'Healthcare administrator and public service veteran'),
        ('CAND007', 'Grace Kim', 'CA', 'CONST002', 35, 'Small business owner and youth mentor'),
        
        # Eastern District (CONST003)
        ('CAND008', 'Henry Ford', 'LU', 'CONST003', 44, 'Technology entrepreneur and innovation advocate'),
        ('CAND009', 'Iris Chen', 'PDP', 'CONST003', 39, 'Labor union leader and workers\' rights activist'),
        ('CAND010', 'Jack Thompson', 'CA', 'CONST003', 50, 'Former police chief and public safety expert'),
        ('CAND011', 'Kelly Johnson', 'PP', 'CONST003', 42, 'Social worker and community organizer'),
        
        # Western District (CONST004)
        ('CAND012', 'Luis Rodriguez', 'GF', 'CONST004', 46, 'Marine biologist and coastal preservation advocate'),
        ('CAND013', 'Maria Santos', 'PDP', 'CONST004', 37, 'Fishing industry representative and economic development specialist'),
        ('CAND014', 'Nathan Brown', 'IND', 'CONST004', 49, 'Tourism industry leader and cultural preservation advocate'),
        
        # Central District (CONST005)
        ('CAND015', 'Olivia Taylor', 'PP', 'CONST005', 43, 'Urban planning specialist and infrastructure expert'),
        ('CAND016', 'Peter Davis', 'CA', 'CONST005', 51, 'Financial services executive and fiscal policy expert'),
        ('CAND017', 'Quinn Anderson', 'LU', 'CONST005', 40, 'Civil rights lawyer and constitutional law expert'),
        ('CAND018', 'Rachel White', 'PDP', 'CONST005', 36, 'Housing rights advocate and social justice activist'),
        
        # Riverside District (CONST006)
        ('CAND019', 'Samuel Lee', 'GF', 'CONST006', 47, 'Agricultural economist and rural development specialist'),
        ('CAND020', 'Tina Garcia', 'PP', 'CONST006', 34, 'Teachers\' union representative and education reform advocate'),
        ('CAND021', 'Victor Martinez', 'CA', 'CONST006', 53, 'Farm cooperative leader and agricultural policy expert')
    ]
    
    for cand_id, name, party_id, const_id, age, description in candidates:
        cursor.execute("""
            INSERT INTO candidates (candidate_id, candidate_name, party_id, constituency_id, age, description)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (cand_id, name, party_id, const_id, age, description))
    
    print(f"Inserted {len(candidates)} candidates")

def populate_electors(cursor):
    """Populate electors table with diverse demographics"""
    print("Generating electors data...")
    
    # Get constituencies and polling stations
    cursor.execute("SELECT constituency_id FROM constituencies")
    constituencies = [row[0] for row in cursor.fetchall()]
    
    cursor.execute("SELECT polling_station_id, constituency_id FROM pollingstations")
    polling_stations = cursor.fetchall()
    
    # Create mapping of constituencies to their polling stations
    const_to_stations = {}
    for station_id, const_id in polling_stations:
        if const_id not in const_to_stations:
            const_to_stations[const_id] = []
        const_to_stations[const_id].append(station_id)
    
    # Common names for realistic data
    first_names = [
        'Alex', 'Blake', 'Casey', 'Drew', 'Ellis', 'Finley', 'Gray', 'Hayden', 'Indigo', 'Jamie',
        'Kai', 'Lane', 'Morgan', 'Nova', 'Ocean', 'Parker', 'Quinn', 'River', 'Sage', 'Taylor',
        'Uma', 'Vale', 'Winter', 'Xander', 'Yara', 'Zion', 'Aria', 'Belle', 'Cedar', 'Dawn',
        'Echo', 'Faith', 'Grace', 'Hope', 'Iris', 'Joy', 'Luna', 'Maya', 'Nova', 'Olive',
        'Peace', 'Rose', 'Star', 'True', 'Unity', 'Vera', 'Wise', 'Zara'
    ]
    
    last_names = [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
        'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
        'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
        'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
        'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
    ]
    
    electors_per_constituency = 80  # Reduced for faster processing
    electors = []
    elector_counter = 1
    
    for const_id in constituencies:
        available_stations = const_to_stations.get(const_id, [])
        if not available_stations:
            continue
            
        for i in range(electors_per_constituency):
            elector_id = f"ELE{elector_counter:05d}"
            name = f"{random.choice(first_names)} {random.choice(last_names)}"
            age = random.randint(18, 85)
            gender = random.choice(['M', 'F', 'O'])
            address = f"{random.randint(100, 9999)} {random.choice(['Main', 'Oak', 'Pine', 'Elm', 'Maple'])} {random.choice(['St', 'Ave', 'Dr', 'Blvd', 'Ln'])}"
            phone = f"98765{random.randint(10000, 99999)}"
            station_id = random.choice(available_stations)
            
            electors.append((elector_id, name, age, gender, address, phone, const_id, station_id))
            elector_counter += 1
    
    # Insert in batches for better performance
    batch_size = 100
    for i in range(0, len(electors), batch_size):
        batch = electors[i:i + batch_size]
        cursor.executemany("""
            INSERT INTO electors (elector_id, elector_name, age, gender, address, phone_number, constituency_id, polling_station_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, batch)
    
    print(f"Inserted {len(electors)} electors")
    return len(electors)

def populate_votes(cursor, total_electors):
    """Populate votes table with realistic voting patterns"""
    print("Generating votes data...")
    
    # Get all electors
    cursor.execute("SELECT elector_id, constituency_id FROM electors")
    electors = cursor.fetchall()
    
    # Get candidates per constituency
    cursor.execute("SELECT candidate_id, constituency_id, party_id FROM candidates")
    candidates = cursor.fetchall()
    
    # Create mapping of constituencies to candidates
    const_to_candidates = {}
    for cand_id, const_id, party_id in candidates:
        if const_id not in const_to_candidates:
            const_to_candidates[const_id] = []
        const_to_candidates[const_id].append((cand_id, party_id))
    
    # Simulate 75% voter turnout
    voting_electors = random.sample(electors, int(len(electors) * 0.75))
    
    votes = []
    vote_counter = 1
    
    for elector_id, const_id in voting_electors:
        available_candidates = const_to_candidates.get(const_id, [])
        if not available_candidates:
            continue
        
        # Weighted random selection (some parties more popular)
        candidate_weights = []
        for cand_id, party_id in available_candidates:
            if party_id in ['PP', 'CA']:  # Major parties
                weight = 0.3
            elif party_id in ['GF', 'PDP']:  # Medium parties
                weight = 0.2
            else:  # Smaller parties/independents
                weight = 0.1
            candidate_weights.append(weight)
        
        selected_candidate = random.choices(available_candidates, weights=candidate_weights)[0]
        
        vote_id = f"VOTE{vote_counter:06d}"
        timestamp = datetime.now() - timedelta(days=random.randint(0, 30))
        
        votes.append((vote_id, elector_id, selected_candidate[0], timestamp))
        vote_counter += 1
    
    # Insert in batches
    batch_size = 100
    for i in range(0, len(votes), batch_size):
        batch = votes[i:i + batch_size]
        cursor.executemany("""
            INSERT INTO votes (vote_id, elector_id, candidate_id, timestamp)
            VALUES (%s, %s, %s, %s)
        """, batch)
    
    print(f"Inserted {len(votes)} votes")

def populate_users(cursor):
    """Populate users table with authentication data"""
    print("Creating user accounts...")
    
    # Hash password function
    def hash_password(password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    users = [
        # Admin users
        ('admin001', 'admin@election.gov', hash_password('admin123'), 'admin', 'Election Administrator', True, True),
        ('admin002', 'admin2@election.gov', hash_password('admin123'), 'admin', 'System Administrator', True, True),
        
        # Officer accounts (using their IDs)
        ('RO001', 'john.smith@election.gov', hash_password('officer123'), 'officer', 'John Smith', True, True),
        ('RO002', 'sarah.johnson@election.gov', hash_password('officer123'), 'officer', 'Sarah Johnson', True, True),
        ('RO003', 'michael.brown@election.gov', hash_password('officer123'), 'officer', 'Michael Brown', True, True),
        ('PO001', 'james.thompson@election.gov', hash_password('officer123'), 'officer', 'James Thompson', True, True),
        ('PO002', 'patricia.clark@election.gov', hash_password('officer123'), 'officer', 'Patricia Clark', True, True),
        
        # Sample elector accounts
        ('ELE00001', 'elector1@demo.com', hash_password('elector123'), 'elector', 'Demo Elector 1', True, True),
        ('ELE00002', 'elector2@demo.com', hash_password('elector123'), 'elector', 'Demo Elector 2', True, True),
        ('ELE00003', 'elector3@demo.com', hash_password('elector123'), 'elector', 'Demo Elector 3', True, True),
        
        # Test accounts
        ('test_admin', 'test@admin.com', hash_password('test123'), 'admin', 'Test Admin', True, True),
        ('test_officer', 'test@officer.com', hash_password('test123'), 'officer', 'Test Officer', True, True),
        ('test_elector', 'test@elector.com', hash_password('test123'), 'elector', 'Test Elector', True, True),
    ]
    
    for user_id, email, password_hash, role, full_name, is_verified, is_active in users:
        cursor.execute("""
            INSERT INTO users (user_id, email, password_hash, role, full_name, is_verified, is_active, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (user_id, email, password_hash, role, full_name, is_verified, is_active, datetime.now()))
    
    print(f"Inserted {len(users)} user accounts")

def main():
    """Main function to populate the database"""
    print("Starting safe database population...")
    
    conn = connect_db()
    if not conn:
        print("Failed to connect to database")
        return
    
    try:
        cursor = conn.cursor()
        
        # Clear existing data first
        clear_existing_data(cursor)
        
        # Populate tables in order of dependencies
        populate_constituencies(cursor)
        populate_parties(cursor)
        populate_polling_stations(cursor)
        populate_officers(cursor)
        populate_candidates(cursor)
        
        # Populate electors and get count
        total_electors = populate_electors(cursor)
        
        # Populate votes based on electors
        populate_votes(cursor, total_electors)
        
        # Populate user accounts
        populate_users(cursor)
        
        # Commit all changes
        conn.commit()
        print("\n✅ Database population completed successfully!")
        print("\nTest accounts created:")
        print("Admin: test_admin / test123")
        print("Officer: test_officer / test123") 
        print("Elector: test_elector / test123")
        print("\nDefault accounts:")
        print("Admin: admin001 / admin123")
        print("Officer: RO001 / officer123")
        print("Elector: ELE00001 / elector123")
        
    except Exception as e:
        print(f"Error during population: {e}")
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    main()