import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import api from '../api/api';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialIcons'; // já importe no topo


export default function HomeScreen() {
  const [planos, setPlanos] = useState([]);
  const navigation = useNavigation();

  const [editandoId, setEditandoId] = useState(null);
  const [descricaoEditada, setDescricaoEditada] = useState('');

  
  useEffect(() => {
    carregarPlanos();
  }, []);
  const salvarEdicaoPlano = async (id) => {
    try {
      await api.put(`/planos/${id}`, { nome: descricaoEditada });
      setEditandoId(null);
      setDescricaoEditada('');
      carregarPlanos();
    } catch (error) {
      console.error('Erro ao editar plano:', error);
    }
  };
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
      {editandoId === item.id ? (
        <TextInput
          value={descricaoEditada}
          onChangeText={setDescricaoEditada}
          onBlur={() => salvarEdicaoPlano(item.id)}
          onSubmitEditing={() => salvarEdicaoPlano(item.id)}
          autoFocus
          style={styles.cardTitulo}
        />
      ) : (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.cardTitulo}>{item.nome}</Text>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation(); // evita abrir detalhes ao clicar no lápis
              setEditandoId(item.id);
              setDescricaoEditada(item.nome);
            }}
          >
            <Icon name="edit" size={20} color="#6a1b9a" />
          </TouchableOpacity>
        </View>
      )}
  
      <Text style={styles.cardSubtitulo}>🎯 {item.diaSemana}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Seus Planos de Estudo</Text>
      <TouchableOpacity
      
      onPress={carregarPlanos}><Text style={styles.titulo}>Atualizar</Text></TouchableOpacity>
  
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
  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3c2f5a',
    paddingVertical: 4,
  },
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
