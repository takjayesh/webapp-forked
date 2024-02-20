# Build AMI and Deploy: Assignment Management System 📚

## Overview 🌟
The Assignment Management System is a Node.js-based application designed to streamline the process of managing assignments. It enables users to effortlessly create, modify, and eliminate assignments. Additionally, it supports the submission of assignments, enforcing rules such as submission limits and deadlines. The platform integrates user authentication through basic HTTP authentication, utilizing email and password for secure access.

## Key Technologies 🚀
- **Node.js**: Powers the server-side logic with JavaScript.
- **Express**: A web application framework for managing HTTP requests and responses.
- **Sequelize**: The ORM of choice for database interactions.
- **bcrypt**: Provides password hashing for secure user authentication.
- **AWS SDK**: Facilitates communication with Amazon SNS for message publishing.
- **Winston**: Delivers comprehensive logging capabilities, both to console and files.
- **CSV Parser**: Enables the processing of CSV files for account management.
- **StatsD**: A tool for collecting custom metrics from the application.

## Database Structure 🗃️
Utilizing Sequelize, the application interacts seamlessly with a relational database. The schema is organized into tables for assignments, users, and submissions, ensuring efficient data management.

## API Endpoints 🌐
### Health Check
- **GET /healthz**: Confirms the database connection's health.

### Assignment Operations
- **GET /v1/assignments**: Lists all assignments.
- **GET /v1/assignments/:id**: Fetches a specific assignment by ID.
- **POST /v1/assignments**: Creates an assignment with detailed validations.
- **PUT /v1/assignments/:id**: Updates an assignment, adhering to strict validations.
- **DELETE /v1/assignments/:id**: Removes an assignment, ensuring ownership.

### Assignment Submissions
- **POST /v1/assignments/:id/submission**: Submits an assignment with precise validations and restrictions.

## Security and Authentication 🔐
The system employs basic HTTP authentication, requiring users to provide credentials via an Authorization header, encoded in base64 for security.

## Features and Integrations 📤
- **Assignment Submissions & SNS**: Enables assignment submissions and integrates with AWS SNS for notifications.
- **Logging**: Utilizes Winston for detailed logging.
- **CSV Processing**: Incorporates a method to parse and process CSV files for user account management.

## Configuration ⚙️
The application's configuration is managed through environment variables, ensuring flexibility and security.

## Running the Application 🚀
1. Install dependencies with `npm install`.
2. Set your environment variables in a `.env` file.
3. Launch the application using `npm start`. It listens on port 3000 by default.

## Testing 🧪
Includes basic integration tests, executable with `npm test` to ensure reliability.

## Deployment 🛠
Suitable for deployment on various hosting services or cloud platforms. Make sure to adjust the environment variables for production environments.

## Contributing 🤝
Contributions are highly appreciated. Feel free to fork the repository, make your improvements, and submit a pull request.

## License 📄
This project is made available under the MIT License, fostering open and collaborative development.
