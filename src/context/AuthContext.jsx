import { useState } from "react";
import { AuthContext } from "./AuthContextValue";
import { login as apiLogin, register as apiRegister, updateProfile as apiUpdateProfile } from "../api/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const persistUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const userData = await apiLogin(email, password);
      persistUser(userData);
      return userData;
    } catch {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = users.find((u) => u.email === email && u.password === password);
      if (foundUser) {
        persistUser(foundUser);
        return foundUser;
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const userData = await apiRegister(name, email, password);
      persistUser(userData);
      return userData;
    } catch {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.find((u) => u.email === email)) {
        return null;
      }
      const newUser = { id: Date.now(), name, email, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      persistUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateProfile = async (updates) => {
    if (!user) return null;
    try {
      const updatedUser = await apiUpdateProfile(user.id, updates);
      persistUser(updatedUser);
      return updatedUser;
    } catch {
      const updatedUser = { ...user, ...updates };
      persistUser(updatedUser);
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const index = users.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem("users", JSON.stringify(users));
      }
      return updatedUser;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
