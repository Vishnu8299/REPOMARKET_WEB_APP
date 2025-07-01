import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  getToken: () => Promise<string | null>;
  login: (email: string, password: string, role: UserRole) => Promise<{ user: User }>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
    organization?: string;
    phoneNumber?: string;
  }) => Promise<{ token: string; user: User }>;
  logout: () => Promise<void>;
  signUp: (data: { name: string; email: string; password: string; role: UserRole; companyName?: string; phoneNumber?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('Initializing auth with stored data:', {
            token: storedToken ? 'exists' : 'missing',
            user: parsedUser
          });
          setUser(parsedUser);
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      setIsLoading(true);
      const result = await api.login(email, password, role);
      
      console.log('Login successful, setting auth state:', {
        token: result.token ? 'exists' : 'missing',
        user: result.user
      });

      // Store the token and user data
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Update the state
      setToken(result.token);
      setUser(result.user);
      setIsAuthenticated(true);
      
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    organization?: string;
    phoneNumber?: string;
  }): Promise<{ token: string; user: User }> => {
    try {
      const response = await api.register(userData);
      
      // Update auth state with new user data
      setUser(response.user);
      setToken(response.token);
      setIsAuthenticated(true);
      setIsLoading(false);

      // Store the token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      return response;
    } catch (error) {
      console.error('Registration error details:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  const signUp = async (data: { 
    name: string; 
    email: string; 
    password: string; 
    role: UserRole; 
    companyName?: string;
    phoneNumber?: string;
  }) => {
    try {
      const response = await api.register(data);
      // Update auth state with new user data from response
      setUser(response.user);
      setToken(response.token);
      setIsAuthenticated(true);
      setIsLoading(false);

      // Store the token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      console.error('SignUp error details:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    getToken: async () => token,
    login,
    register,
    logout,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};