import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import db from '../database/db';

export default function NewPlanScreen({ navigation }) {
  const [nome, setNome] = useState('');

  const salvarPlano = () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Digite o nome do plano.');
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO planos (nome) VALUES (?);',
        [nome],
        () => {
          setNome('');
          navigation.goBack();
        },
        (_, error) => {
          console.error('Erro ao salvar plano:', error);
          return false;
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome do plano"
        value={nome}
        onChangeText={setNome}
      />
      <Button title="Salvar Plano" onPress={salvarPlano} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginBottom: 16,
    borderRadius: 6,
  },
});
