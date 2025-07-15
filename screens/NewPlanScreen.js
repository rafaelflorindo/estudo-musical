import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/api';
import { useNavigation } from '@react-navigation/native';

export default function NewPlanScreen() {
  const [nome, setNome] = useState('');
  const [diaSemana, setDiaSemana] = useState('Segunda');
  const navigation = useNavigation();

  const criarPlano = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Informe o nome do plano.');
      return;
    }
    try {
      await api.post('/planos', { nome, diaSemana });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar plano.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Novo Plano de Estudo</Text>

      <Text style={styles.label}>Nome do Plano</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Técnica de Arco"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Dia da Semana</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={diaSemana}
          onValueChange={setDiaSemana}
          style={styles.picker}
        >
          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(dia => (
            <Picker.Item key={dia} label={dia} value={dia} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.botao} onPress={criarPlano}>
        <Text style={styles.botaoTexto}>Criar Plano</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fef9fb' },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6a1b9a',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#4b3b57',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 32,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  botao: {
    backgroundColor: '#6a1b9a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
