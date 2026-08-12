# Learning Path Builder - SkillHub

A responsive single-page Learning Path Builder that allows students to browse available course modules and create a personalized learning path.

## Tech Stack

### Frontend:
- HTML5
- CSS3
- JavaScript ES6+
- Bootstrap 5

### Backend:
- Python
- Django
- Django REST Framework
- SQLite/PostgreSQL

## Project Structure

```text
learning-path-builder/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── backend/
│   ├── manage.py
│   ├── config/
│   ├── modules/
│   ├── requirements.txt
│   └── ...
│
├── .env.example
├── .gitignore
└── README.md

---

## Running the Project

### Terminal 1 — Backend

```bash
cd backend

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Start Django server
python manage.py runserver
```

### Terminal 2 — Frontend

Open the `frontend/` directory using VS Code Live Server.

---

## Environment Variables
Create a .env file in the backend directory using .env.example as a reference.

## API

GET /api/modules/

POST /api/save-path/

## Validation

Advanced modules require their prerequisite modules
to be selected before the learning path can be saved.


