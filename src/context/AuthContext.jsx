import { useState } from 'react';
import { login as loginAPI, register as registerAPI } from '../api';
import { AuthContext } from './authContextInstance';

export function AuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const { data } = await loginAPI({ email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUserInfo(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await registerAPI({ name, email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUserInfo(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// `useAuth` moved to a dedicated hook file to keep this file exporting only components
