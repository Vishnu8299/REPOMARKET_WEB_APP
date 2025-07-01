import { create } from 'zustand';

export type UserRole = 'admin' | 'developer' | 'buyer';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

export const checkAuthorization = (requiredRole: UserRole) => {
  const { user } = useAuth.getState();
  if (!user) return false;
  return user.role === requiredRole;
};
