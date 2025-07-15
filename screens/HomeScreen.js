import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../api/api';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [planos, setPlanos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    carregarPlanos();
  }, []);

  const carregarPlanos = async () => {
    try {
      const response = await api.get('/planos');
      setPlanos(response.data);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetalhesPlano', { planoId: item.id })}
    >
      <Text style={styles.cardTitulo}>{item.nome}</Text>
      <Text style={styles.cardSubtitulo}>🎯 {item.diaSemana}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Seus Planos de Estudo</Text>

      <FlatList
        data={planos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity
        style={styles.botaoNovo}
        onPress={() => navigation.navigate('NovoPlano')}
      >
        <Text style={styles.botaoTexto}>+ Novo Plano</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffdf8', padding: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#6a1b9a' },
  card: {
    backgroundColor: '#f5e9ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#6a1b9a',
  },
  cardTitulo: { fontSize: 18, fontWeight: 'bold' },
  cardSubtitulo: { marginTop: 4, color: '#555' },
  botaoNovo: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#6a1b9a',
    padding: 16,
    borderRadius: 32,
    elevation: 4,
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
});
