import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      const token = await AsyncStorage.getItem('token');
      const nome = await AsyncStorage.getItem('usuarioNome');
      const id = await AsyncStorage.getItem('usuarioId');

      if (token && nome && id) {
        setUsuario({ id, nome });
      }
    };
    carregarUsuario();
  }, []);

  const login = async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    const { token, usuario } = response.data;

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('usuarioNome', usuario.nome);
    await AsyncStorage.setItem('usuarioId', String(usuario.id));

    setUsuario(usuario);
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
