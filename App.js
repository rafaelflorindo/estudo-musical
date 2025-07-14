import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import NewPlanScreen from './screens/NewPlanScreen';
import PlanDetailScreen from './screens/PlanDetailScreen';
//import { setupDatabase } from './database/db';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    //setupDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Meus Planos de Estudo' }} />
        <Stack.Screen name="NovoPlano" component={NewPlanScreen} options={{ title: 'Novo Plano' }} />
        <Stack.Screen name="DetalhesPlano" component={PlanDetailScreen} options={{ title: 'Tarefas do Plano' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
