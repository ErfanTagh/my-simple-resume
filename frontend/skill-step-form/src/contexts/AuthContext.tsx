import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedTokens = localStorage.getItem('tokens');
    
    if (storedUser && storedTokens) {
      setUser(JSON.parse(storedUser));
      setTokens(JSON.parse(storedTokens));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle unverified email error (403)
        if (response.status === 403 && data.email_verified === false) {
          throw new Error(data.error || 'Please verify your email before logging in.');
        }
        throw new Error(data.error || 'Login failed');
      }

      setUser(data.user);
      setTokens(data.tokens);
      
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('tokens', JSON.stringify(data.tokens));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    try {
      const response = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          first_name: firstName || '',
          last_name: lastName || '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // New flow: Registration doesn't log in immediately
      // User must verify email first, so tokens won't be in response
      // Don't set user/tokens here - they'll need to login after verification
      
      return data; // Return the response so Signup page can show the message
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (tokens?.refresh) {
        await fetch('/api/auth/logout/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens.access}`,
          },
          body: JSON.stringify({ refresh: tokens.refresh }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setTokens(null);
      localStorage.removeItem('user');
      localStorage.removeItem('tokens');
    }
  };

  const value = {
    user,
    tokens,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!tokens,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

