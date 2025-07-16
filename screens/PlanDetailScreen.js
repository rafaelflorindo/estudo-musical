import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import api from '../api/api';

export default function PlanDetailScreen({ route, navigation }) {
  const { planoId } = route.params;
  const [plano, setPlano] = useState(null);
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [descricaoEditada, setDescricaoEditada] = useState('');

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

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
      await api.post(`/planos/${planoId}/tarefas`, { descricao: novaTarefa });
      setNovaTarefa('');
      carregarTarefas();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao adicionar tarefa.');
      console.error(error);
    }
  };

 const alternarConclusao = async (tarefa) => {
  try {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await api.put(`/tarefas/${tarefa.id}`, {
      concluida: !tarefa.concluida,
    });
    carregarTarefas();
  } catch (error) {
    Alert.alert('Erro', 'Falha ao atualizar tarefa.');
    console.error(error);
  }
};
const salvarEdicao = async (tarefaId) => {
  try {
    await api.put(`/tarefas/${tarefaId}`, { descricao: descricaoEditada });
    setEditandoId(null);
    setDescricaoEditada('');
    carregarTarefas();
  } catch (error) {
    Alert.alert('Erro', 'Falha ao editar tarefa.');
    console.error(error);
  }
};

const renderItem = ({ item }) => (
  <View
    style={[
      styles.tarefaItem,
      item.concluida ? styles.tarefaConcluida : styles.tarefaPendente,
    ]}
  >
    {editandoId === item.id ? (
      <TextInput
        value={descricaoEditada}
        onChangeText={setDescricaoEditada}
        onBlur={() => salvarEdicao(item.id)}
        onSubmitEditing={() => salvarEdicao(item.id)}
        autoFocus
        style={styles.tarefaTexto}
      />
    ) : (
      <TouchableOpacity
        onPress={() => alternarConclusao(item)}
        style={{ flex: 1 }}
      >
        <Text
          style={[
            styles.tarefaTexto,
            item.concluida && styles.tarefaTextoConcluida,
          ]}
        >
          {item.descricao}
        </Text>
      </TouchableOpacity>
    )}

    <TouchableOpacity
      onPress={() => {
        setEditandoId(item.id);
        setDescricaoEditada(item.descricao);
      }}
    >
      <Icon name="edit" size={20} color="#6a1b9a" />
    </TouchableOpacity>
  </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  
  tarefaPendente: {
    backgroundColor: '#ffe5e5', // vermelho claro
  },
  
  tarefaConcluida: {
    backgroundColor: '#c8e6c9', // verde claro
  },
  
  tarefaTexto: {
    fontSize: 16,
    color: '#333',
  },
  
  tarefaTextoConcluida: {
    color: '#2e7d32', // verde escuro
    fontWeight: 'bold',
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
