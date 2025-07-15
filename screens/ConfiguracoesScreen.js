import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

export default function ConfiguracoesScreen() {
  const { logout, usuario } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>⚙️ Configurações</Text>
      <Text style={styles.subtitulo}>Usuário: {usuario?.nome}</Text>

      <View style={styles.separador} />
      <Button title="Sair da Conta" onPress={logout} color="#d32f2f" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitulo: { fontSize: 16, marginBottom: 20 },
  separador: { height: 1, backgroundColor: '#ccc', marginBottom: 20 },
});
