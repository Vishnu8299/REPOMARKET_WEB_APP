import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in (e.g., by checking localStorage or making an API call)
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          setUser(null);
          setToken(null);
          return;
        }

        setToken(storedToken);
        // You can add API call here to validate token and get user info
        // const response = await fetch('/api/auth/me', {
        //   headers: { Authorization: `Bearer ${storedToken}` }
        // });
        // const userData = await response.json();
        // setUser(userData);
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    // Implement your login logic here
    // Make API call to your backend
    // Set user data and token in localStorage
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    token
  };
}
