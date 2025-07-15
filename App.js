import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { solicitarPermissao, agendarNotificacao } from './utils/notificacoes';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import NewPlanScreen from './screens/NewPlanScreen';
import PlanDetailScreen from './screens/PlanDetailScreen';
import ProgressoScreen from './screens/ProgressoScreen';
import ConfiguracoesScreen from './screens/ConfiguracoesScreen';

// Telas futuras (podem ser placeholders por enquanto)
/*function ProgressoScreen() {
  return null;
}
function ConfiguracoesScreen() {
  return null;
}*/

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabsPrivadas() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Estudos: 'musical-notes',
            Progresso: 'bar-chart',
            Configuracoes: 'settings',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Estudos" component={HomeScreen} />
      <Tab.Screen name="Progresso" component={ProgressoScreen} />
      <Tab.Screen name="Configuracoes" component={ConfiguracoesScreen} />
    </Tab.Navigator>
  );
}

function RotasPrivadas() {
  const { usuario } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {usuario ? (
        <>
          <Stack.Screen name="Tabs" component={TabsPrivadas} options={{ headerShown: false }} />
          <Stack.Screen name="NovoPlano" component={NewPlanScreen} />
          <Stack.Screen name="DetalhesPlano" component={PlanDetailScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Registrar" component={RegisterScreen} options={{ title: 'Criar Conta' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    async function configurarNotificacoes() {
      const permitido = await solicitarPermissao();
      if (permitido) {
        await agendarNotificacao(
          'Hora de estudar 🎶',
          'Lembre-se de praticar seu plano musical hoje!',
          20,
          0
        );
      }
    }
    configurarNotificacoes();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <RotasPrivadas />
      </NavigationContainer>
    </AuthProvider>
  );
}
