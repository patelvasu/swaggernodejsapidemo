# Swagger API Documentation Project 📜

This project demonstrates how to create, manage, and serve API documentation using Swagger. It provides an interactive interface for exploring and testing RESTful APIs, making it easier to understand and integrate APIs directly from the browser.

## Swagger UI Example 🎨

Access interactive API documentation for different API groups (User API and Admin API) at the following endpoints:

- [User API Docs](http://localhost:3001/api/swagger/)
- [Admin API Docs](http://localhost:3001/admin/swagger/)

---

## Table of Contents 📚

- [Introduction](#introduction)
- [Installation & Configuration](#installation--configuration)
- [Server Setup](#server-setup)
- [Defining API Paths](#defining-api-paths)
- [Handling Parameters](#handling-parameters)
- [Responses](#responses)
- [POST Parameters](#post-parameters)
- [Request Body](#request-body)
- [Multiple Documentation](#multiple-documentation)
- [References](#references)

---

## Introduction ✨

Swagger (OpenAPI) is a powerful framework for describing RESTful APIs in a machine-readable format. This project leverages Swagger to:

- Automatically generate interactive API documentation.
- Enable API testing directly from the browser.
- Simplify API development and maintenance.

### Key Concepts:

- API documentation is defined in YAML or JSON format.
- Supports all HTTP methods (GET, POST, PUT, DELETE, etc.).
- Defines endpoints, parameters, responses, and authentication.
- Allows API testing and exploration via Swagger UI.

---

## Installation & Configuration ⚙️

### 1. Install Dependencies

To get started, install the necessary dependencies for the project:

```bash
npm install swagger-ui-express yamljs swagger
```

### 2. Access Interactive Documentation

Once the server is running, you can access the interactive documentation at the following routes:

- **User API:** [http://localhost:3001/api/swagger/](http://localhost:3001/api/swagger/)
- **Admin API:** [http://localhost:3001/admin/swagger](http://localhost:3001/admin/swagger)

---

## Server Setup 🚀

Set up the Express server to serve the Swagger UI for multiple API groups (User API and Admin API). Below is the configuration for loading and serving two separate Swagger YAML files:

```javascript
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();

// Load Swagger YAML files
const userDocs = YAML.load('./swagger/user-api.yaml');
const adminDocs = YAML.load('./swagger/admin-api.yaml');

// Serve Swagger UI
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(userDocs));
app.use('/admin/swagger', swaggerUi.serve, swaggerUi.setup(adminDocs));

// Start server
app.listen(3001, () => {
  console.log('Swagger docs available at http://localhost:3001/{api/admin}/swagger');
});
```

---

## Defining API Paths 🔑

In your Swagger YAML file, define the available API paths (endpoints) for each API. Here's an example of defining a `GET` endpoint for retrieving all users:

```yaml
paths:
  /users:
    get:
      summary: Get all users
      responses:
        200:
          description: List of users
```

---

## Handling Parameters 📝

You can specify parameters for your API endpoints. For example, to retrieve a user by their `id`, you can define the parameter as follows:

```yaml
/users/{id}:
  get:
    parameters:
      - in: path
        name: id
        required: true
        schema:
          type: integer
    responses:
      200:
        description: User details
```

---

## Responses 🏁

Swagger allows you to document the possible responses for each API endpoint. Here's an example of documenting the `200 OK` response and a `404 Not Found` response:

```yaml
responses:
  200:
    description: Success
    content:
      application/json:
        schema:
          type: array
          items:
            $ref: '#/components/schemas/User'
  404:
    description: User not found
```

---

## POST Parameters 📨

For handling `POST` requests with form data or URL-encoded parameters, you can define them like this:

```yaml
post:
  requestBody:
    content:
      application/x-www-form-urlencoded:
        schema:
          type: object
          properties:
            username:
              type: string
            password:
              type: string
```

---

## Request Body 🗂️

For more complex request bodies, such as JSON payloads, you can define the request body schema as follows:

```yaml
post:
  requestBody:
    required: true
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/User'
```

---

## Multiple Documentation 📑

This project demonstrates how to serve different Swagger documentation for multiple API groups. The User API and Admin API each have their own YAML definition files, and they are mounted on separate routes:

- `/api/swagger` for User API docs
- `/admin/swagger` for Admin API docs

This setup is particularly useful for role-based API segregation, where different users or roles need different access to API documentation.

---

## References 📚

- [Swagger Official Documentation](https://swagger.io/docs/)
- [OpenAPI Specification](https://spec.openapis.org/oas/v3.0.0)
- [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express)

--- 

Feel free to customize this project for your own API documentation needs and explore all the features Swagger offers! 🚀