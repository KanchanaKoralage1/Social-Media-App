# 🌐 PathFinder Social Media Web App

A full-stack social media application built with Spring Boot backend and React frontend, featuring user authentication, posts, comments, sharing, messaging, and real-time notifications.

## 🎥 Demo Video

## ✨ Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Google OAuth2 integration
  - Secure password encryption
  - User registration and login

- **Social Media Core Features**
  - Create, edit, and delete posts
  - Like, comment and share on posts
  - Save posts for later viewing
  - User profiles with customizable information
  - Follow/unfollow other users

- **Messaging System**
  - Real-time private messaging
  - Conversation management
  - Message history

- **Notifications**
  - Real-time notifications for likes, comments, and share
  - Notification management system

- **User Discovery**
  - Explore page to discover new users
  - User suggestions based on activity
  - Search functionality

- **Responsive Design**
  - Mobile-friendly interface
  - Modern UI with Tailwind CSS

## 🚀 Getting Started

### Prerequisites

Before running this application, make sure you have the following installed:

- **Java 17** 
- **Node.js 16** or higher
- **npm** 
- **MySQL 8.0** or higher
- **Maven 3.6** or higher
- **Git**

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/pathfinder-social-media.git](https://github.com/KanchanaKoralage1/Social-Media-App.git)
   ```

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Configure MySQL Database**
   - Create a MySQL database named socialmedia
   - Update database credentials in src/main/resources/application.properties:<br/>
   
   ```bash
   spring.datasource.url=jdbc:mysql://localhost:3306/socialmedia?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```

4. **Configure Google OAuth2 (Optional)**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth2 credentials
   - Update `application.properties`: <br/>
   
   ```bash
   spring.security.oauth2.client.registration.google.client-id=your_google_client_id
   spring.security.oauth2.client.registration.google.client-secret=your_google_client_secret
   ```

5. **Configure JWT Secret**
   
   - Generate a secure JWT secret key
   - Update in `application.properties`: <br/>
   
   ```bash
   jwt.secret=your_jwt_secret_key
   jwt.expiration=86400000
   ```

7. **Run the backend application**
   ```bash
   ./mvnw spring-boot:run
   ```
   
   Or using Maven:
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd/frontend
   ```

2. **Install dependencies**
   
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## 📦 Dependencies

### Backend Dependencies
- **Spring Boot 3.2.3** - Main framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations
- **MySQL Connector** - Database driver
- **JWT (jsonwebtoken)** - Token-based authentication
- **Lombok** - Reduce boilerplate code
- **Spring OAuth2 Client** - Google OAuth integration

### Frontend Dependencies
 **"dependencies": {** <br/>
    "@tailwindcss/vite": "^4.1.10",<br/>
    "axios": "^1.10.0",<br/>
    "lucide-react": "^0.536.0",<br/>
    "react": "^19.1.0",<br/>
    "react-dom": "^19.1.0",<br/>
    "react-icons": "^5.5.0",<br/>
    "react-router-dom": "^7.6.2"<br/>
  **}**<br/>
  
## ⚙️ Usage

1. **Explore the features:**
   - Create your first post
   - Follow other users
   - Like, comment and share on posts
   - Send messages to other users
   - Customize your profile
   - Save interesting posts

2. **Google OAuth Login** :
   - Click on "Login with Google" button
   - Authorize the application
   - You'll be automatically logged in

## 🧰 Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.3**
- **Spring Security**
- **Spring Data JPA**
- **MySQL 8.0**
- **JWT Authentication**
- **Maven**

### Frontend
- **React 18**
- **JavaScript**
- **Vite**
- **Tailwind CSS**
- **HTML5 & CSS3**

### Tools & Services
- **Google OAuth2**
- **Git & GitHub**
- **MySQL Workbench** (database management)
- **Postman** (for API testing)
- **Google Cloud Console** (for google login)

## 👤 Author

- [Kanchana Koralage](https://github.com/KanchanaKoralage1)


## 🙏 Acknowledgments

- **Spring Boot Team** for the excellent framework
- **React Team** for the powerful frontend library
- **Tailwind CSS** for the utility-first CSS framework
- **Google** for OAuth2 integration
- **MySQL** for the reliable database system
- **Vite** for the fast build tool and development server



