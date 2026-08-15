# Ensemble-Based Fake News Detection

A full-stack web application that detects whether a news article is **Fake** or **Real** using an ensemble of a classical ML model (Random Forest + TF-IDF) and a Transformer model (DistilBERT), combined through a meta-classifier. The prediction also comes with a SHAP-based explanation highlighting the key influential words.

The project has three independent services that run together:

| Service      | Tech                                  | Port  | Role                                              |
|--------------|----------------------------------------|-------|----------------------------------------------------|
| `ml_backend` | Python, Flask, PyTorch, scikit-learn    | 5000  | Loads the models and returns predictions           |
| `backend`    | Node.js, Express, MongoDB (Mongoose)    | 8000  | Auth (signup/login), history, calls `ml_backend`   |
| `frontend`   | React (Create React App)                | 3000  | Signup, Login and Home (prediction) pages          |

```
Ensemble-Based-Fake-News-Detection/
├── backend/            # Node.js + Express API (auth, history, proxy to Flask)
│   ├── app.js
│   ├── index.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── services/
├── frontend/            # React app (Signup, Login, Home pages)
│   ├── public/
│   └── src/
│       ├── pages/          # Login.jsx, Signup.jsx
│       ├── components/     # InputBox, ResultBox, ExplanationBox, ProtectedRoute
│       ├── context/         # AuthContext.jsx
│       └── services/        # authService.js, predictionService.js
├── ml_backend/          # Flask API serving the ensemble model
│   ├── app.py
│   ├── pipeline.py
│   ├── preprocess.py
│   ├── explainability.py
│   └── requirements.txt
├── models/              # Saved model artifacts (.pkl / .pt)
└── data/                # Datasets (Fake.csv, True.csv, WELFake_Dataset.csv, ...)
```

---

## Prerequisites

Install these before you start (check versions in the VS Code terminal):

- **Node.js** (v18+) and npm → `node -v` / `npm -v`
- **Python** (3.10+) → `python --version`
- **MongoDB** running locally, or a MongoDB Atlas connection string
- **Git**
- **VS Code** with the terminal open (`` Ctrl+` ``)

---

## 1. Clone the project

Open VS Code, open a terminal (`` Ctrl+` ``), and run:

```bash
git clone https://github.com/aryannn03/Ensemble-Based-Fake-News-Detection.git
cd Ensemble-Based-Fake-News-Detection
```

Open the cloned folder in VS Code: `code .`

---

## 2. Set up the ML backend (Flask) — Python virtual environment

All commands below are run in the VS Code terminal.

```bash
# from the project root
cd ml_backend

# create a virtual environment
python -m venv venv

# activate it
# Windows (PowerShell)
venv\Scripts\Activate.ps1
# Windows (cmd.exe)
venv\Scripts\activate.bat
# macOS / Linux
source venv/bin/activate

# install dependencies
pip install -r requirements.txt
```

> The venv folder is created inside `ml_backend/`. Keep it activated (you'll see `(venv)` in the terminal prompt) whenever you run the Flask server.

---

## 3. Set up the backend (Node.js / Express)

Open a **new terminal** in VS Code (`` Ctrl+Shift+` ``) so the Python venv terminal keeps running separately.

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=8000
MONGODB_URL=mongodb://127.0.0.1:27017/fake-news-detection
JWT_SECRET=your_jwt_secret_here
FLASK_BASE_URL=http://localhost:5000
NODE_ENV=development
```

Replace `MONGODB_URL` with your MongoDB Atlas URI if you're not running MongoDB locally.

---

## 4. Set up the frontend (React)

Open another **new terminal** in VS Code.

```bash
cd frontend
npm install
```

The frontend already proxies API calls to `http://localhost:8000` (set in `frontend/package.json`), so no `.env` file is required for local development. If you want to point it to a different backend URL, create a `.env` file inside `frontend/`:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

---

## 5. Run the whole project (3 VS Code terminals)

Use three separate terminal tabs/panes in VS Code — one per service — and keep all three running at the same time.

**Terminal 1 — ML backend (Flask)**
```bash
cd ml_backend
venv\Scripts\Activate.ps1      # or source venv/bin/activate on macOS/Linux
python app.py
```
Runs on `http://localhost:5000`

**Terminal 2 — Backend (Express)**
```bash
cd backend
npm run dev
```
Runs on `http://localhost:8000`

**Terminal 3 — Frontend (React)**
```bash
cd frontend
npm start
```
Runs on `http://localhost:3000` and opens automatically in the browser.

> Start the services in this order: `ml_backend` → `backend` → `frontend`, since the backend calls the ML service and the frontend calls the backend.

---

## Application Pages

Once all three services are running, open **http://localhost:3000**.

### Signup Page (`/signup`)
- New users create an account with **name, email, and password**.
- On success, a JWT is issued and the user is logged in automatically.
- File: `frontend/src/pages/Signup.jsx`

### Login Page (`/login`)
- Existing users sign in with **email and password**.
- On success, a JWT is stored and the user is redirected to the Home page.
- File: `frontend/src/pages/Login.jsx`

### Home Page (`/`)
- **Protected route** — only accessible after logging in (`ProtectedRoute.jsx` redirects to `/login` otherwise).
- Contains the news input box (`InputBox.jsx`) where a user pastes/types an article.
- Submits the text to the backend, which forwards it to the ML service, and displays:
  - Prediction (**Fake** / **Real**)
  - Confidence percentage and confidence level
  - Key influential words (explanation)
- Includes a **Logout** button.

---

## Screenshots

Below are the interface previews for the three main pages. Add your own screenshots by following the steps underneath each image.

### Signup Page
![Signup Page](docs/screenshots/signup.png)

### Login Page
![Login Page](docs/screenshots/login.png)

### Home Page
![Home Page](docs/screenshots/home.png)

## Quick Start Summary

```bash
# Terminal 1
cd ml_backend && venv\Scripts\Activate.ps1 && python app.py

# Terminal 2
cd backend && npm run dev

# Terminal 3
cd frontend && npm start
```

Then visit **http://localhost:3000/signup** to create an account, log in, and start detecting fake news.

---

## Troubleshooting

- **"Cannot connect to server"** → make sure `backend` (port 8000) is running.
- **500 error on signup/login** → check MongoDB is running/reachable and `JWT_SECRET`/`MONGODB_URL` are set in `backend/.env`.
- **Prediction fails** → make sure `ml_backend` (port 5000) is running and the virtual environment is activated with all dependencies installed.
- **CORS / proxy issues** → confirm `frontend/package.json` still has `"proxy": "http://localhost:8000"`, or set `REACT_APP_API_URL` explicitly.
