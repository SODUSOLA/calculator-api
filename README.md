# 🧮 Terminal + Web Calculator API

This project is a **hybrid calculator** built with **Node.js**, offering both a **terminal-based prompt** and a **modern web interface**. It performs basic arithmetic operations like **Addition, Subtraction, Division and Multiplication** and stores all calculations in **MongoDB**.

---

## 🚀 Features

- 💻 **Command-Line Interface (CLI)**: Perform calculations directly in the terminal using `readline`.
- 🌐 **Express Web Server**: View the last calculation on `http://localhost:3000` in a sleek, responsive UI.
- 🗃️ **MongoDB Integration**: All operations, results and time calculations were made are stored persistently in a database using **Mongoose**.
- 🔁 **Live Reload Button**: Refresh the homepage with the latest results at the click of a button.
- 🔒 **Error Handling**: Prevents division by zero and invalid inputs with user-friendly messages.

---

## 🛠️ Tech Stack

- **Node.js** + **Express**
- **MongoDB** with **Mongoose**
- **HTML + CSS** for frontend rendering
- **readline** for interactive terminal input

---

## 📂 Project Structure
calculator-project/
├── models/
│   └── calculation.js          # Mongoose schema for MongoDB documents
├── node_modules/               # Node.js dependencies
├── .gitignore                  # Files/folders Git should ignore
├── index.js                    # Main server and CLI logic
├── package-lock.json           # Dependency lock file
├── package.json                # Project metadata and dependencies
└── README.md                   # Project Documentation, You're here 😉