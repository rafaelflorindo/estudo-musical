import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import api from '../api/api';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();

  const registrar = async () => {
    if (!nome || !email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
      await api.post('/auth/registrar', { nome, email, senha });
      await login(email, senha); // login automático
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', err.response?.data?.erro || 'Erro ao registrar');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome} />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Senha" style={styles.input} secureTextEntry value={senha} onChangeText={setSenha} />
      <Button title="Registrar" onPress={registrar} />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.link}>
        <Text style={styles.linkText}>Já tenho uma conta. Fazer login.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 6 },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#007bff' },
});
