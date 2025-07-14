import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import db from '../database/db';
import { useIsFocused } from '@react-navigation/native';

export default function PlanDetailScreen({ route }) {
  const { planoId, nome } = route.params;
  const [tarefas, setTarefas] = useState([]);
  const [descricao, setDescricao] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    carregarTarefas();
  }, [isFocused]);

  const carregarTarefas = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tarefas WHERE plano_id = ?;',
        [planoId],
        (_, { rows }) => setTarefas(rows._array)
      );
    });
  };

  const adicionarTarefa = () => {
    if (!descricao.trim()) return;

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO tarefas (plano_id, descricao) VALUES (?, ?);',
        [planoId, descricao],
        () => {
          setDescricao('');
          carregarTarefas();
        }
      );
    });
  };

  const alternarConclusao = (id, atual) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE tarefas SET concluida = ? WHERE id = ?;',
        [atual ? 0 : 1, id],
        () => carregarTarefas()
      );
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.tarefaItem, item.concluida ? styles.tarefaConcluida : null]}
      onPress={() => alternarConclusao(item.id, item.concluida)}
    >
      <Text style={styles.tarefaTexto}>{item.descricao}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{nome}</Text>

      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma tarefa adicionada.</Text>}
      />

      <TextInput
        style={styles.input}
        placeholder="Nova tarefa"
        value={descricao}
        onChangeText={setDescricao}
      />
      <Button title="Adicionar Tarefa" onPress={adicionarTarefa} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titulo: { fontSize: 22, marginBottom: 12, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 6,
  },
  tarefaItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
    borderRadius: 6,
  },
  tarefaConcluida: {
    backgroundColor: '#d3ffd3',
  },
  tarefaTexto: { fontSize: 16 },
  vazio: { textAlign: 'center', marginVertical: 16, color: '#777' },
});
