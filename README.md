## 🗳️ Election Management System

The Election Management System is a full-stack web application designed to digitally manage elections within a constituency. It supports secure authentication, role-based access (Admin, Officer, Elector), vote casting, and real-time result visualization. The system is built using Node.js, Express.js, PostgreSQL, Sequelize, React.js, Tailwind CSS, and Bootstrap.

# Group 8 - Team Members
- Adamya Sharma      - AM.AI.U4AID23024 
- Harita Aneesh      - AM.AI.U4AID23042       
- Santhanalakshmi    - AM.AI.U4AID23057 
- Mounish Senisetty  - AM.AI.U4AID23058

A full-stack web application for managing elections, including admin, officer, and elector roles. Features include user authentication, role-based dashboards, live results, and demo accounts for easy testing.

## Features

- **Role-based authentication:** Admin, Officer (multiple types), Elector  
- **Responsive dashboards** for each role  
- **Live election results** with charts and statistics  
- **Elector verification and voting**  
- **Polling station management**  
- **Demo accounts** for quick access and testing  
- **Accessible, mobile-friendly UI** (React + Tailwind CSS)  

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS  
- **Backend:** Node.js, Express, Sequelize, PostgreSQL  
- **Authentication:** Custom context, localStorage  
- **Charts:** Chart.js  

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)  
- npm or yarn  
- PostgreSQL  

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/election-management.git
   cd election-management
   ```

2. **Install dependencies:**
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. **Configure the database:**
   - Edit `backend/config/db.js` with your PostgreSQL credentials.
   - Create the database in PostgreSQL if it does not exist.

4. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

5. **Start the frontend development server:**
   ```bash
   cd frontend
   npm run dev
   # or
   yarn dev
   ```

6. **Access the app:**
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
election-management/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── App.css
│   └── tailwind.config.js
└── README.md
```

## Customization

- **Add new roles:** Update the roles array in the signup form and backend logic.
- **Change demo accounts:** Edit the `demoAccounts` object in `frontend/src/pages/public/Login.jsx`.
- **Styling:** Modify Tailwind config or CSS files for custom themes.

## Accessibility

- Login and signup forms use proper `autoComplete` attributes for accessibility and password manager support.
- Responsive navigation menus for all screen sizes.

## License

[MIT](LICENSE)
