# 📱 PhoneBook Application (Frontend)

This is the **ReactJS frontend** for the PhoneBook CRUD application.
It connects to a Go backend API to manage contacts.

---

# 🚀 Prerequisites

Make sure you have the following installed:

* Node.js (latest recommended)
* npm or yarn
* Backend service running (see below)

---

# 🔗 Backend Setup (Required First)

Clone and run the backend repository:

```bash
git clone https://github.com/smituz-for-simform/trainee_backend.git
cd trainee_backend
go run main.go
```

Backend will run on:

```text
http://localhost:8080
```

### ⚙️ Important

Make sure backend has CORS enabled:

```go
r.Use(cors.Default())
```

---

# 📦 Frontend Setup

Clone this repository:

```bash
git clone https://github.com/smituz-for-simform/trainee_frontend.git
cd trainee_frontend
```

Install dependencies:

```bash
npm install
```

Start the React app:

```bash
npm start
```

Frontend will run on:

```text
http://localhost:3000
```

---

# 🌐 Application Routes

## 🏠 Home Page

```text
http://localhost:3000/
```

### Features:

* Displays all contacts (GET API)
* Delete contact (DELETE API with confirmation)
* Navigation buttons:

  * Add Contact
  * Update Contact

---

## ➕ Add Contact Page

```text
http://localhost:3000/add_contact
```

### Features:

* Form to add new contact
* Validates input via backend
* On success → redirects to Home page

---

## ✏️ Update Contact Page

```text
http://localhost:3000/update_contact
```

### Features:

* Lists all contacts
* Inline editing using ✏️ button
* Save updated contact
* On success → redirects to Home page

---

# 🔌 API Endpoints Used

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| GET    | `/get_contacts`    | Fetch all contacts      |
| POST   | `/add_contact`     | Create new contact      |
| PUT    | `/update_contact`  | Update existing contact |
| DELETE | `/del_contact/:id` | Delete contact          |

---

# ⚠️ Common Issues

### ❌ Network Error / Failed to fetch

* Ensure backend is running on port `8080`
* Ensure correct API base URL in frontend:

```js
const API = "http://localhost:8080";
```

---

### ❌ CORS Errors

Fix by enabling CORS in backend:

```go
import "github.com/gin-contrib/cors"

r.Use(cors.Default())
```

---

### ❌ JSON Parse Errors

* Do not open API routes via frontend port (`3000`)
* Always call backend via `8080`

---

# 📌 Notes

* This project is built for learning **Full Stack + DevOps fundamentals**
* Backend and frontend are intentionally simple for Docker/K8s deployment practice

---

# 🚀 Future Improvements

* Add frontend validation
* Replace alerts with notifications
* Improve UI with Tailwind or component libraries
* Add authentication layer

---

# 👨‍💻 Author

Developed as part of DevOps training.
