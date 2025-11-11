# Authentication Guide

This document explains how to use the JWT authentication system in the Resume Backend API.

## Overview

The API uses JWT (JSON Web Tokens) for authentication with two types of tokens:

- **Access Token**: Short-lived (1 hour), used to authenticate API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

## Quick Start

### 1. Register a New User

```bash
POST /api/auth/register/
```

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### 2. Login

```bash
POST /api/auth/login/
```

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "securepass123"
}
```

**Response:** Same as registration

### 3. Use Access Token

Include the access token in the Authorization header for all protected endpoints:

```bash
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**Example:**

```bash
GET /api/resumes/
Headers:
  Authorization: Bearer YOUR_ACCESS_TOKEN
  Content-Type: application/json
```

### 4. Refresh Access Token

When your access token expires (after 1 hour), use the refresh token to get a new one:

```bash
POST /api/auth/token/refresh/
```

**Request Body:**

```json
{
  "refresh": "YOUR_REFRESH_TOKEN"
}
```

**Response:**

```json
{
  "access": "NEW_ACCESS_TOKEN",
  "refresh": "NEW_REFRESH_TOKEN"
}
```

### 5. Logout

Blacklist the refresh token to prevent it from being used:

```bash
POST /api/auth/logout/
```

**Request Body:**

```json
{
  "refresh": "YOUR_REFRESH_TOKEN"
}
```

## Frontend Integration

### React/JavaScript Example

```javascript
// Store tokens after login/registration
const login = async (username, password) => {
  const response = await fetch("http://localhost:8000/api/auth/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (response.ok) {
    // Store tokens in localStorage or secure storage
    localStorage.setItem("accessToken", data.tokens.access);
    localStorage.setItem("refreshToken", data.tokens.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  }

  throw new Error(data.error || "Login failed");
};

// Make authenticated requests
const getResumes = async () => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch("http://localhost:8000/api/resumes/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    // Token expired, try to refresh
    await refreshToken();
    return getResumes(); // Retry with new token
  }

  return response.json();
};

// Refresh token when access token expires
const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  const response = await fetch(
    "http://localhost:8000/api/auth/token/refresh/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    }
  );

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    return data;
  }

  // Refresh token invalid, redirect to login
  localStorage.clear();
  window.location.href = "/login";
};

// Logout
const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  await fetch("http://localhost:8000/api/auth/logout/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  localStorage.clear();
  window.location.href = "/login";
};
```

### Axios Interceptor Example

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Add access token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post(
          "http://localhost:8000/api/auth/token/refresh/",
          { refresh: refreshToken }
        );

        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

## Security Best Practices

1. **HTTPS**: Always use HTTPS in production
2. **Secure Storage**: Store tokens securely (httpOnly cookies are better than localStorage)
3. **Token Expiration**: Access tokens expire after 1 hour for security
4. **Refresh Rotation**: Refresh tokens are rotated on each use
5. **Token Blacklist**: Logout blacklists refresh tokens
6. **Password Strength**: Enforce strong passwords in frontend
7. **Rate Limiting**: Consider adding rate limiting for login attempts

## Error Handling

### Common Error Responses

**401 Unauthorized:**

```json
{
  "detail": "Authentication credentials were not provided."
}
```

**401 Invalid Token:**

```json
{
  "detail": "Given token not valid for any token type",
  "code": "token_not_valid"
}
```

**400 Bad Request:**

```json
{
  "error": "Username and password are required"
}
```

## Testing with curl

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Save the access token from response
ACCESS_TOKEN="your_access_token_here"

# Create a resume
curl -X POST http://localhost:8000/api/resumes/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d @resume.json

# Get resumes
curl -X GET http://localhost:8000/api/resumes/ \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

## Troubleshooting

### "Authentication credentials were not provided"

- Make sure you're including the Authorization header
- Check the token format: `Bearer <token>`
- Verify the token hasn't expired

### "Token not valid"

- Access token expired (refresh it)
- Refresh token expired (login again)
- Token was blacklisted (logout/login)

### "User already exists"

- Username or email is already registered
- Try a different username/email or login

## API Endpoints Summary

| Method | Endpoint                   | Auth Required | Description              |
| ------ | -------------------------- | ------------- | ------------------------ |
| POST   | `/api/auth/register/`      | No            | Register new user        |
| POST   | `/api/auth/login/`         | No            | Login user               |
| POST   | `/api/auth/logout/`        | Yes           | Logout (blacklist token) |
| POST   | `/api/auth/token/refresh/` | No            | Refresh access token     |
| GET    | `/api/auth/profile/`       | Yes           | Get user profile         |
| GET    | `/api/resumes/`            | Yes           | List user's resumes      |
| POST   | `/api/resumes/`            | Yes           | Create resume            |
| GET    | `/api/resumes/{id}/`       | Yes           | Get resume               |
| PUT    | `/api/resumes/{id}/`       | Yes           | Update resume            |
| DELETE | `/api/resumes/{id}/`       | Yes           | Delete resume            |
