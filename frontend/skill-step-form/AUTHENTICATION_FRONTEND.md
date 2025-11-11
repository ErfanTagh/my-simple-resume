# Frontend Authentication Guide

## Overview

The frontend now includes a complete authentication system with JWT token management.

## Features

✅ **User Registration** - Sign up with username, email, and password
✅ **User Login** - Sign in and receive JWT tokens
✅ **Protected Routes** - CV form only accessible after login
✅ **Token Management** - Automatic token storage in localStorage
✅ **User Profile Display** - Show logged-in user info in header
✅ **Logout Functionality** - Clear tokens and redirect to login
✅ **Beautiful UI** - Modern, responsive design with shadcn/ui

## Pages

### Login Page (`/login`)

- Username/password authentication
- Error handling with visual feedback
- Link to signup page
- Redirects to home after successful login

### Signup Page (`/signup`)

- User registration form
- Fields: username, email, password, first name, last name
- Password confirmation validation
- Automatic login after registration
- Link to login page

### Protected Pages

- **Home (`/`)** - CV form builder (requires authentication)
- Automatically redirects to login if not authenticated

## Components

### AuthContext

**Location:** `src/contexts/AuthContext.tsx`

Provides authentication state and methods throughout the app:

```typescript
const {
  user, // Current user object
  tokens, // Access and refresh tokens
  isAuthenticated, // Boolean auth status
  isLoading, // Loading state
  login, // Login function
  register, // Register function
  logout, // Logout function
} = useAuth();
```

### Header

**Location:** `src/components/Header.tsx`

Navigation bar with:

- Logo and app name
- User menu (when authenticated)
- Login/Signup buttons (when not authenticated)
- Dropdown with profile and logout options

### ProtectedRoute

**Location:** `src/components/ProtectedRoute.tsx`

Wrapper component that:

- Shows loading spinner while checking auth
- Redirects to `/login` if not authenticated
- Renders children if authenticated

## Usage Examples

### Using Authentication in Components

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Requests

```typescript
import { useAuth } from "@/contexts/AuthContext";

function CreateResume() {
  const { tokens } = useAuth();

  const createResume = async (data) => {
    const response = await fetch("http://localhost:8000/api/resumes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.access}`,
      },
      body: JSON.stringify(data),
    });

    return response.json();
  };

  // ... rest of component
}
```

## Token Storage

Tokens are stored in `localStorage`:

- `user` - User object (id, username, email, etc.)
- `tokens` - JWT tokens (access and refresh)

**Security Note:** For production, consider using httpOnly cookies instead of localStorage for better security.

## Error Handling

### Login Errors

- Invalid credentials
- Network errors
- Server errors

All errors are displayed in a red alert banner above the form.

### Registration Errors

- Username already exists
- Email already registered
- Password mismatch
- Validation errors

## Styling

The authentication pages use:

- **shadcn/ui** components for consistent design
- **Tailwind CSS** for styling
- **Lucide Icons** for icons
- **Responsive design** - works on mobile and desktop

## Flow Diagram

```
User visits site
    │
    ├─> Not authenticated? ──> Redirect to /login
    │                              │
    │                              ├─> Login ──> Store tokens ──> Redirect to /
    │                              │
    │                              └─> Signup ──> Store tokens ──> Redirect to /
    │
    └─> Authenticated? ──> Access protected routes
                              │
                              ├─> Build CV
                              ├─> View profile
                              └─> Logout ──> Clear tokens ──> Redirect to /login
```

## Configuration

### API Endpoint

Update the API URL in `src/contexts/AuthContext.tsx`:

```typescript
const response = await fetch("http://localhost:8000/api/auth/login/", {
  // ... change URL here
});
```

For production, use environment variables:

```typescript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
```

## Running the App

1. Make sure the backend is running on `http://localhost:8000`
2. Start the frontend:
   ```bash
   cd frontend/skill-step-form
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173`
4. You'll be redirected to login
5. Create an account or login
6. Start building your CV!

## Troubleshooting

### "Failed to login"

- Check backend is running
- Verify correct username/password
- Check browser console for errors

### Redirected to login repeatedly

- Clear localStorage: `localStorage.clear()`
- Check if tokens are expired
- Verify backend authentication endpoints are working

### CORS Errors

- Ensure backend `CORS_ALLOWED_ORIGINS` includes `http://localhost:5173`
- Check backend is running on correct port

## Next Steps

Consider adding:

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Remember me checkbox
- [ ] Social login (Google, GitHub)
- [ ] Profile editing page
- [ ] Token refresh on API errors
- [ ] Better error messages
- [ ] Loading states throughout app
