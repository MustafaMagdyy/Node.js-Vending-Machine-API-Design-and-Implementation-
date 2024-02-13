# FlapKap-s-Backend-challenge
Vending Machine API contains a RESTful API designed to simulate the backend functionality of a vending machine. The API allows users to perform various actions such as signing up, logging in, managing their account, depositing funds, buying products, and managing products (for sellers). It is built using Node.js, Express.js, and MongoDB.
# Key Features
  1-User authentication and authorization with JWT tokens
  2-User management (signup, login, update profile, delete account)
  3-Account balance management (depositing funds, resetting balance)
  4-Product management (creation, retrieval, update, and deletion)
  5-Role-based access control for certain operations (e.g., only sellers can manage products)
  6-Error handling and validation using custom middleware
  7-Secure password storage using bcrypt hashing
  8-Rate limiting, data sanitization, and protection against common security vulnerabilities (XSS, CSRF)
#Usage  
  1-Clone the repository to your local machine.
  2-Install dependencies using npm install.
  3-Set up environment variables by creating a .env file and adding necessary configurations.
  4-Start the server using npm start or npm run start:dev for development mode.
  5-Access the API endpoints using your preferred HTTP client (e.g., Postman).
