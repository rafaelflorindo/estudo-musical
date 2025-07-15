import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📈 Seu Progresso</Text>
      <Text style={styles.texto}>Aqui você verá seu desempenho com os estudos.</Text>
      <Text style={styles.destaque}>💡 Em breve: estatísticas diárias e semanais!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  texto: { fontSize: 16, textAlign: 'center', color: '#555' },
  destaque: { marginTop: 20, fontSize: 16, color: '#6a1b9a' },
});
