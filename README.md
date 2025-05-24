# FlixFinder - Movie Review + Personalized Recommendation Full-stack App

This is a full-stack movie review and personalized recommendation application built with Django for the backend and React for the frontend.

## Features

- **User Authentication**: Register, login, and logout using JWT-based authentication.
- **Movie Management**: Users can add, rate/review, and delete movies from their list.
- **Search Functionality**: Real-time search results as you type.
- **Trending Movies Carousel**: A sliding carousel showcasing trending movies.
- **Recommendation Engine**: Personalized movie suggestions based on user ratings and movie metrics using scikit-learn's cosine similarity. Does not recommend movies already in the user's list.
- **Persistent Data**: All movies and ratings are actively saved.

## Technologies Used

- **Backend**: Django, Django REST Framework
- **Frontend**: React, React Router, Axios
- **Database**: PostgreSQL
- **Machine Learning**: Scikit-Learn
- **Environment**: Virtualenv, Vite
- **Version Control**: Git

## Limitations

- **Dataset Size**: The recommendation system currently relies on a dataset of the top 1000 IMDb movies. If a user adds a movie not included in this dataset, recommendations may not be accurate or generated at all.
- **Poster Quality**: Some movie posters may appear slightly blurry due to resolution limitations in the current dataset. I'm actively working on sourcing higher-quality images and expanding the dataset to improve both accuracy and presentation.

## Live Demo

[Live Demo](https://movie-review-rec-app-5dee.vercel.app/)

## Prerequisites

- Python: Version 3.8 or above
- Node.js: Version 14 or above
- PostgreSQL: Version 12 or above

## Setup Instructions

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/JustinKim13/Movie-Review-Rec-App.git
   cd Movie-Review-Rec-App
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

5. **Create a .env file in the backend directory**:
   ```bash
   touch backend/.env
    ```
   
6. **Add the following contents with your own database credentials**:
   ```bash
   DB_HOST='your_database_host'
   DB_PORT='your_database_port'
   DB_USER='your_database_user'
   DB_NAME='your_database_name'
   DB_PWD='your_database_password'
   SECRET_KEY='your_secret_key'
    ```

7. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
    ```
   
7. **Run the server**:
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
   npm install axios react-router-dom jwt-decode vite @vitejs/plugin-react react-icons --save-dev
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

## Troubleshooting

- Database Connection Issues: Ensure PostgreSQL is running and credentials in settings.py are correct.
- CORS Issues: Ensure the frontend URL is added to the allowed origins in the backend settings.
