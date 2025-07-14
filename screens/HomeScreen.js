import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet } from 'react-native';
import db from '../database/db';
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [planos, setPlanos] = useState([]);
  const isFocused = useIsFocused(); // atualiza lista ao voltar para essa tela

  useEffect(() => {
    carregarPlanos();
  }, [isFocused]);

  const carregarPlanos = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM planos;',
        [],
        (_, { rows }) => setPlanos(rows._array),
        (_, error) => {
          console.error('Erro ao buscar planos:', error);
          return false;
        }
      );
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.planoItem}
      onPress={() => navigation.navigate('DetalhesPlano', { planoId: item.id, nome: item.nome })}
    >
      <Text style={styles.planoTexto}>{item.nome}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={planos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum plano cadastrado.</Text>}
      />
      <Button title="Criar Novo Plano" onPress={() => navigation.navigate('NovoPlano')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  planoItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
  },
  planoTexto: { fontSize: 18 },
  vazio: { textAlign: 'center', marginVertical: 16, color: '#777' },
});
