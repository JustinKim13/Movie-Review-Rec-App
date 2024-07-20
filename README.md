# Note-Creator-Full-Stack-App

This is a full-stack note-creating application built with Django for the backend and React for the frontend.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete notes
- Responsive design
- JWT-based authentication
- Axios for API requests

## Technologies Used

- **Backend**: Django, Django REST Framework
- **Frontend**: React, React Router, Axios
- **Database**: PostgreSQL
- **Environment**: Virtualenv, Vite
- **Version Control**: Git

## Setup Instructions

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/JustinKim13/Note-Creator-Full-Stack-App.git
   cd Note-Creator-Full-Stack-App
    ```
2. **Navigate to the backend directory**:
   ```bash
   cd backend
    ```

3. **Create a virtual environment and activate it**:
   ```bash
   python3 -m venv env
   source env/bin/activate
    ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
    ```

5. **Run the server**:
   ```bash
   python manage.py runserver
    ```

### Connecting Backend to Frontend

1. **Create '.env' file in 'frontend' directory**
   ```bash
   touch frontend/.env
    ```

2. **Add the following line to '.env' file**
   ```bash
   VITE_API_URL=''
    ```

2. **Update the '.env' file with your development server url**
   ```bash
   VITE_API_URL='PLACE YOUR URL HERE FROM TERMINAL (http:// ... ) make sure no trailing /'
    ```

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
    ```

2. **Install dependencies**:
   ```bash
   npm install axios react-router-dom jwt-decode
    ```

3. **Run development server**:
   ```bash
   npm run dev
    ```

### Rerun Backend

1. **Quit old backend server to reconnect with new URL**:
   ```bash
   cmd + c
    ```

2. **Restart backend server**:
   ```bash
   python manage.py runserver
    ```