# FlapKap-s-Backend-challenge
***
Vending Machine API contains a RESTful API designed to simulate the backend functionality of a vending machine. The API allows users to perform various actions such as signing up, logging in, managing their account, depositing funds, buying products, and managing products (for sellers). It is built using Node.js, Express.js, and MongoDB.
## Key Features
* User authentication and authorization with JWT tokens
* User management (signup, login, update profile, delete account)
* Account balance management (depositing funds, resetting balance)
* Product management (creation, retrieval, update, and deletion)
* Role-based access control for certain operations (e.g., only sellers can manage products)
* Error handling and validation using custom middleware
* Secure password storage using bcrypt hashing
* Rate limiting, data sanitization, and protection against common security vulnerabilities (XSS, CSRF)
## Usage  
* Clone the repository to your local machine.
* Install dependencies using npm install.
* Set up environment variables by creating a .env file and adding necessary configurations.
* Start the server using npm start or npm run start:dev for development mode.
* Access the API endpoints using your preferred HTTP client (e.g., Postman).


