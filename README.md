# 🛒 Grocery Management System

This is an ongoing full-stack **Grocery Management System** built using **React + Bootstrap** for the frontend and **Python Flask** for the backend API. The project manages grocery products, categories, and inventory with database support.

## ✅ Features

- Add / Update / Delete Products
- Manage Orders and Customers
- Soft Delete using is_active flag
- Auto Total Calculation for Cart / Orders
- REST APIs built using Flask
- MySQL Workbench schema included

## 🧱 Tech Stack

| Layer    | Technology             |
| :------- | :--------------------- |
| Frontend | React, Bootstrap       |
| Backend  | Python Flask           |
| Database | MySQL (Workbench .mwb) |
| Tools    | Postman, Git & GitHub  |

## 🗄 Database Schema

- Database is designed using MySQL Workbench
- The .mwb file is included in the repo inside /database/ folder
- You can open it using MySQL Workbench → File → Open Model
- Note: SQL dump (.sql) file is not provided yet. You can generate SQL from the model if needed (Database → Forward Engineer in Workbench).

## ▶️ How to Run — Backend (Flask)

```
cd backend
pip install -r requirements.txt
python server.py
```

Server will run at:
http://localhost:5000

## ▶️ How to Run — Frontend (React)

```
cd frontend
npm install
npm run dev
```

React App will run at:
http://localhost:5173

## 📌 Status

Project is currently Ongoing and actively being developed.

## 🤝 Contributing

This is an individual learning project — contributions are not open yet.

## 📜 License

This project is open-source under the [MIT License]().
