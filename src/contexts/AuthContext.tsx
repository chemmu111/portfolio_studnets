import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContextType } from '../types';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export { AuthContext };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (token) {
        const { data, error } = await supabase
          .from('admins')
          .select('id, username')
          .eq('id', token)
          .maybeSingle();

        if (data && !error) {
          setIsAuthenticated(true);
          setIsAdmin(true);
        } else {
          localStorage.removeItem('admin_token');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', username)
        .maybeSingle();

      if (error || !data) {
        console.log('Login error or no user found:', error);
        toast.error('Invalid credentials');
        return false;
      }

      // Direct password comparison (for demo purposes)
      if (data.password_hash === password) {
        localStorage.setItem('admin_token', data.id);
        setIsAuthenticated(true);
        setIsAdmin(true);
        setEmail(data.email);
        toast.success('Login successful!');
        return true;
      } else {
        console.log('Password mismatch');
        toast.error('Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setEmail(null);
    toast.success('Logged out successfully');
  };

  // Add setAuthState for backend-driven login
  const setAuthState = ({ isAuthenticated, isAdmin, email }: { isAuthenticated: boolean; isAdmin: boolean; email: string }) => {
    setIsAuthenticated(isAuthenticated);
    setIsAdmin(isAdmin);
    setEmail(email);
  };

  const value: AuthContextType = {
    isAuthenticated,
    isAdmin,
    login,
    logout,
    loading,
    setAuthState,
    email,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};