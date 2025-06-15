import { create } from 'zustand';
import { AuthUser, UserRole } from '../types';

interface AuthState {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@jobportal.com',
  password: 'admin123',
};

// Mock user database
const mockUsers: Record<string, { password: string } & AuthUser> = {
  [ADMIN_CREDENTIALS.email]: {
    id: 'admin-1',
    email: ADMIN_CREDENTIALS.email,
    name: 'Admin User',
    role: 'admin',
    password: ADMIN_CREDENTIALS.password,
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (email: string, password: string) => {
    const user = mockUsers[email];
    if (user && user.password === password) {
      const { password: _, ...authUser } = user;
      set({ user: authUser });
      return true;
    }
    return false;
  },
  register: async (email: string, password: string, name: string, role: UserRole) => {
    if (role === 'admin' || mockUsers[email]) {
      return false;
    }

    const newUser = {
      id: `user-${Object.keys(mockUsers).length + 1}`,
      email,
      name,
      role,
      password,
    };

    mockUsers[email] = newUser;
    const { password: _, ...authUser } = newUser;
    set({ user: authUser });
    return true;
  },
  logout: () => set({ user: null }),
}));