# Employee Management App - Frontend

Welcome to the **Employee Management App** frontend repository! This application is designed to help manage employee records efficiently. It provides a user-friendly interface to perform CRUD (Create, Read, Update, Delete) operations on employee data.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Installation](#installation)
4. [Running the Application](#running-the-application)
5. [Folder Structure](#folder-structure)
6. [API Integration](#api-integration)
7. [Environment Variables](#environment-variables)
8. [Contributing](#contributing)
9. [License](#license)

---

## Features

- **View Employee List**: Display a list of all employees with details like name, email, position, and department.
- **Add New Employee**: A form to add a new employee to the system.
- **Edit Employee Details**: Update existing employee information.
- **Delete Employee**: Remove an employee from the system.
- **Search and Filter**: Search and filter employees by name, department, or position.
- **Responsive Design**: The app is fully responsive and works on all devices (desktop, tablet, mobile).

---

## Technologies Used

- **React.js**: A JavaScript library for building user interfaces.
- **React Router**: For handling routing and navigation within the app.
- **Axios**: For making HTTP requests to the backend API.
- **Tailwind CSS**: A utility-first CSS framework for styling the app.
- **React Hook Form**: For handling form inputs and validation.
- **React Icons**: For adding icons to the app.
- **Vercel**: For hosting the frontend application.

---

## Installation

To run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/employee-app-frontend.git
   cd employee-app-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   REACT_APP_API_URL=http://your-backend-api-url
   ```

4. **Run the application**:
   ```bash
   npm start
   ```

5. **Open the app**:
   Visit `http://localhost:3000` in your browser.

---

## Running the Application

- **Development Mode**:
  ```bash
  npm start
  ```
  This will start the development server on `http://localhost:3000`.

- **Production Build**:
  ```bash
  npm run build
  ```
  This will create an optimized production build in the `build` folder.

- **Deploy to Vercel**:
  Push your changes to the `main` branch, and Vercel will automatically deploy the app.

---

## Folder Structure

```
employee-app-frontend/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Application pages
│   ├── services/            # API service calls
│   ├── utils/               # Utility functions
│   ├── App.js               # Main application component
│   ├── index.js             # Entry point
│   └── styles/              # Global styles
├── .env                     # Environment variables
├── .gitignore               # Files to ignore in Git
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

---

## API Integration

The frontend communicates with the backend API to perform CRUD operations. Below are the endpoints used:

- **Get All Employees**: `GET /api/employees`
- **Add New Employee**: `POST /api/employees`
- **Update Employee**: `PUT /api/employees/:id`
- **Delete Employee**: `DELETE /api/employees/:id`

Example API call using Axios:
```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getEmployees = async () => {
  const response = await axios.get(`${API_URL}/employees`);
  return response.data;
};
```

---

## Environment Variables

The following environment variables are required:

- `REACT_APP_API_URL`: The base URL of the backend API.

Example:
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes.
4. Push your branch and open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for using the **Employee Management App**! If you have any questions or feedback, feel free to reach out. 😊
