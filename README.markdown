# Anime Website

## Overview
Anime Website is a full-stack web application designed for anime enthusiasts to search, explore, and save their favorite anime. Built with a modern tech stack, the application integrates with the Jikan API (based on MyAnimeList) to fetch anime data and uses a PostgreSQL database to store user favorites. The website features user authentication, a dynamic anime search, detailed anime information, and a personalized favorites list, all wrapped in a responsive and user-friendly interface.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Future Features](#future-features)
- [Acknowledgments](#acknowledgments)
- [License](#license)
- [Contact](#contact)

## Features
- **User Authentication**:
  - Secure sign-up with password hashing using bcrypt.
  - Login with session-based authentication via express-session.
  - Logout functionality with session termination.
- **Anime Listing**:
  - Displays a list of anime fetched dynamically from the Jikan API.
  - Features a carousel on the homepage highlighting the top 3 anime.
- **Search Functionality**:
  - Search bar for finding anime by name, with results fetched from the Jikan API.
  - Search results rendered on a dedicated page.
- **Anime Details Page**:
  - Detailed view for each anime (accessible via `/anime/:id`), including synopsis, score, episodes, and more.
- **Favorites Feature**:
  - Logged-in users can add anime to their favorites, stored in a PostgreSQL database (using `favorites` and `maps` tables to map users to anime).
  - Users can view their personalized favorites list.

## Technologies Used
- **Backend**:
  - **Node.js & Express.js**: Core backend framework for handling routes and API requests.
  - **pg**: PostgreSQL client for database interactions.
  - **bcrypt**: For secure password hashing.
  - **express-session**: For session management and user authentication.
  - **axios**: For making HTTP requests to the Jikan API.
- **Frontend**:
  - **EJS**: Templating engine for rendering dynamic HTML.
  - **HTML5 & CSS3**: For structure and styling, including responsive design.
  - **JavaScript**: For frontend interactivity (e.g., carousel, form validation).
- **API**:
  - **Jikan API v4**: For fetching anime data (search, details, and listings).
- **Database**:
  - **PostgreSQL**: For storing user favorites in the `anime` database with `favorites` and `maps` tables.
- **Version Control**: Git and GitHub for source code management.

## Installation
To set up the Anime Website locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Prasukj7-arch/Anime_Website.git
   cd Anime_Website
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   This installs required Node.js packages (e.g., `express`, `pg`, `bcrypt`, `express-session`, `axios`, `ejs`).

3. **Set Up the PostgreSQL Database**:
   - Install PostgreSQL and pgAdmin if not already installed.
   - Create a database named `anime` in pgAdmin.
   - Create the `favorites` and `maps` tables. Example schema:
     ```sql
     CREATE TABLE favorites (
         id SERIAL PRIMARY KEY,
         anime_id INTEGER NOT NULL,
         title VARCHAR(255) NOT NULL,
         image_url VARCHAR(255)
     );

     CREATE TABLE maps (
         id SERIAL PRIMARY KEY,
         user_id INTEGER NOT NULL,
         anime_id INTEGER NOT NULL
     );
     ```
   - Ensure the database is running on `localhost:5432` (or update the configuration if different).

4. **Configure Environment Variables**:
   - Create a `.env` file in the project root with the following:
     ```env
     DB_USER=youruser
     DB_PASSWORD=yourpass
     DB_NAME=anime
     DB_HOST=localhost
     DB_PORT=5432
     SESSION_SECRET=yoursecret
     ```

5. **Start the Server**:
   ```bash
   node server.js
   ```
   - The application will run on `http://localhost:3000` (or the port specified in `server.js`).

## Usage
- **Homepage**: View the top 3 anime in a carousel and browse available anime fetched from the Jikan API.
- **Sign Up/Login**: Create an account or log in to access personalized features like favorites.
- **Search Anime**: Use the search bar to find anime by name; results are displayed on a dedicated search page.
- **Anime Details**: Click an anime to view its detailed information (synopsis, score, episodes, etc.).
- **Favorites**: Add anime to your favorites list (requires login) and view your saved anime on the favorites page.
- The website is responsive, ensuring a seamless experience across desktops, tablets, and mobile devices.

## Project Structure
```
Anime_Website/
├── public/                    # Static files
│   ├── css/                  # CSS styles
│   │   └── style.css
│   ├── js/                   # Frontend JavaScript
│   │   └── script.js
├── views/                     # EJS templates
│   ├── index.ejs             # Homepage with carousel
│   ├── login.ejs             # Login page
│   ├── signup.ejs            # Sign-up page
│   ├── home.ejs              # Main anime listing page
│   ├── search.ejs            # Search results page
│   ├── description.ejs       # Anime details page
│   └── favorites.ejs         # User favorites page
├── .env                       # Environment variables
├── .gitignore                 # Git ignore rules
├── package.json               # Node.js dependencies
├── package-lock.json          # Dependency lock file
├── server.js                  # Main Express application
└── README.md                  # This file
```

## Deployment
To deploy the Anime Website to a production environment:
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Prasukj7-arch/Anime_Website.git
   cd Anime_Website
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file with the following:
     ```env
     DB_USER=youruser
     DB_PASSWORD=yourpass
     DB_NAME=anime
     DB_HOST=localhost
     DB_PORT=5432
     SESSION_SECRET=yoursecret
     ```

4. **Set Up PostgreSQL**:
   - Configure a PostgreSQL database on your hosting provider (e.g., Render, Heroku, AWS RDS).
   - Update the `.env` file with the production database credentials.
   - Initialize the `favorites` and `maps` tables (see the SQL schema in the Installation section).

5. **Start the Server**:
   ```bash
   node server.js
   ```
   - For production, consider using a process manager like `pm2`:
     ```bash
     npm install -g pm2
     pm2 start server.js
     ```

6. **Hosting Recommendations**:
   - Use platforms like Render, Heroku, or Vercel for easy deployment.
   - Ensure the Jikan API is accessible from your hosting environment (no rate-limiting issues).

## Screenshots
- **Homepage**: Displays a carousel with the top 3 anime and a search bar.
- **Search Results**: Shows anime matching the search query.
- **Anime Description**: Detailed view with synopsis, score, and episodes.
- **Sign Up/Login**: Forms for user registration and authentication.
- **Favorites List**: Personalized list of saved anime for logged-in users.

*Note*: Screenshots can be added to the `public/images/` folder and linked here in the README.

## Future Features
- **Pagination**: Add pagination for search results to improve performance.
- **Watchlist/Reminder**: Allow users to create a watchlist or set reminders for anime.
- **User Profiles**: Enable users to customize profiles with avatars and preferences.
- **Admin Dashboard**: Create an admin interface for managing users and anime data.

## Acknowledgments
- **Jikan API**: For providing comprehensive anime data.
- **PostgreSQL**: For reliable database management.
- **EJS**: For efficient server-side templating.
- **Node.js & Express**: For powering the backend.

## License
This project is licensed under the MIT License.

## Contact
Created by Prasuk Jain  
- **GitHub**: [Prasukj7-arch](https://github.com/Prasukj7-arch)  
- **Email**: prasukjain7@gmail.com