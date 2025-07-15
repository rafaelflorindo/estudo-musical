import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function solicitarPermissao() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function agendarNotificacao(titulo, corpo, hora = 20, minuto = 0) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const agora = new Date();
  const disparo = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), hora, minuto);
  if (disparo < agora) disparo.setDate(disparo.getDate() + 1);

  await Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: corpo },
    trigger: {
      hour: hora,
      minute: minuto,
      repeats: true,
    },
  });
}
