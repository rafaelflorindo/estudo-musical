import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import api from '../api/api';

export default function PlanDetailScreen({ route, navigation }) {
  const { planoId } = route.params;
  const [plano, setPlano] = useState(null);
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');

  useEffect(() => {
    carregarPlano();
    carregarTarefas();
  }, []);

  const carregarPlano = async () => {
    try {
      const response = await api.get(`/planos/${planoId}`);
      setPlano(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar plano.');
      console.error(error);
    }
  };

  const carregarTarefas = async () => {
    try {
      const response = await api.get(`/planos/${planoId}/tarefas`);
      setTarefas(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar tarefas.');
      console.error(error);
    }
  };

  const adicionarTarefa = async () => {
    if (!novaTarefa.trim()) {
      Alert.alert('Atenção', 'Informe o nome da tarefa.');
      return;
    }
    try {
      await api.post(`/planos/${planoId}/tarefas`, { nome: novaTarefa });
      setNovaTarefa('');
      carregarTarefas();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao adicionar tarefa.');
      console.error(error);
    }
  };

  const alternarConclusao = async (tarefa) => {
    try {
      await api.put(`/tarefas/${tarefa.id}`, { concluida: !tarefa.concluida });
      carregarTarefas();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar tarefa.');
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.tarefaItem, item.concluida && styles.tarefaConcluida]}
      onPress={() => alternarConclusao(item)}
    >
      <Text style={[styles.tarefaTexto, item.concluida && styles.tarefaTextoConcluida]}>
        {item.nome}
      </Text>
    </TouchableOpacity>
  );

  if (!plano) {
    return (
      <View style={styles.container}>
        <Text>Carregando plano...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{plano.nome} ({plano.diaSemana})</Text>

      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={styles.novaTarefaWrapper}>
        <TextInput
          placeholder="Nova tarefa"
          value={novaTarefa}
          onChangeText={setNovaTarefa}
          style={styles.input}
        />
        <TouchableOpacity style={styles.botao} onPress={adicionarTarefa}>
          <Text style={styles.botaoTexto}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fffaf8' },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6a1b9a',
  },
  tarefaItem: {
    padding: 16,
    backgroundColor: '#f7e9ff',
    borderRadius: 10,
    marginBottom: 12,
  },
  tarefaConcluida: {
    backgroundColor: '#d1c4e9',
  },
  tarefaTexto: {
    fontSize: 16,
    color: '#3c2f5a',
  },
  tarefaTextoConcluida: {
    textDecorationLine: 'line-through',
    color: '#7a6a9f',
  },
  novaTarefaWrapper: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 12,
  },
  botao: {
    backgroundColor: '#6a1b9a',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
