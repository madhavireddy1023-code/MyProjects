# Housing Project - AI Agent Instructions

## Project Overview
Full-stack ML application for housing price estimation using React frontend, Django REST API backend, and scikit-learn linear regression model.

## Technology Stack
- **Backend**: Django 3.x + DRF, scikit-learn, pandas, joblib
- **Frontend**: React 18, React Router v6, react-hook-form + Zod
- **Database**: SQLite (dev), containerized with Docker
- **ML**: Linear regression with 7 features (square_footage, bedrooms, bathrooms, year_built, lot_size, distance_to_city_center, school_rating)

## Build & Run Commands
**Docker (recommended)**:
```bash
docker-compose up
```
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

**Manual Setup**:
```bash
# Backend
cd backend
pip install -r requirements.txt
python manage.py runserver

# Frontend
cd frontend
npm install
npm start

# Train model (required before API works)
cd backend && python ml/train_model.py
```