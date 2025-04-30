# 🗳️ Election Management System

The Election Management System is a full-stack web application designed to digitally manage elections within a constituency. It supports secure authentication, role-based access (Admin, Officer, Elector), vote casting, and real-time result visualization. The system is built using Node.js, Express.js, PostgreSQL, Sequelize, React.js, Tailwind CSS, and Bootstrap.

---

## 📌 Features

- JWT-based login and signup with role selection
- Role-based dashboards for Admin, Officer, and Elector
- Admin can manage constituencies, polling stations, officers, electors, parties, and candidates
- Officer can view and verify electors at assigned polling stations
- Elector can view candidate list, cast vote (only once), and view live results
- Real-time result chart visualization using vote data
- Fully responsive and mobile-friendly interface
- RESTful APIs with proper authentication and authorization

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (with Vite)
- React Router v6
- Axios (with interceptors for auth)
- React Toastify (notifications)
- Tailwind CSS and Bootstrap (for UI design)

**Backend:**
- Node.js with Express.js
- PostgreSQL with Sequelize ORM
- JWT for secure token-based authentication
- Bcrypt for password hashing
- CORS, dotenv, and middleware-based route protection

---

## 📁 Project Structure
election-management-system/ ├── backend/ │ ├── config/ │ ├── controllers/ │ ├── middleware/ │ ├── models/ │ ├── routes/ │ ├── migrations/ │ ├── server.js │ └── .env
├── frontend/ │ ├── public/ │ ├── src/ │ │ ├── components/ │ │ ├── pages/ │ │ ├── services/ │ │ ├── contexts/ │ │ └── App.jsx │ ├── tailwind.config.js │ └── vite.config.js


---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/election-management-system.git
cd election-management-system

PORT=5000
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_secret_key

npx sequelize-cli db:migrate

#To start backend server
npm start

#To start frontend
cd ../frontend
npm install
npm run dev

🚀 Usage
Visit http://localhost:5173 to open the frontend.

Register as Admin, Officer, or Elector.

Login and access your role-specific dashboard.

Admin can manage entire election setup.

Officers verify electors before voting.

Electors vote once and view results.

🔐 Roles and Permissions
Admin

Add/edit/delete constituencies, polling stations, officers, electors, parties, candidates

View vote counts and results

Officer

View electors by polling station

Mark electors as verified

Elector

View candidates

Cast a single vote

View voting status and results

📊 Visual Features
Voting cards with candidate and party info

Elector profile view

Bar/pie chart visualizations for results

Table views for admin/officer operations

Role-based navigation and protected routes

📄 License
This project is developed for academic purposes only.

👨‍💻 Authors
Mounish – Admin & Officer Dashboards

Teammate 2 – Elector Dashboard & Voting

Teammate 3 – Result Charts & Profile Pages

Teammate 4 – Backend Routes & Authentication
