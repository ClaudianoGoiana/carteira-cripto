// Inicializa o armazenamento antes de liberar as rotas do aplicativo.
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { inicializarBanco } from '../db';
import { cores } from '../estilos/global';

export default function RootLayout() {
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    inicializarBanco().then(() => setPronto(true)).catch(() => setPronto(true));
  }, []);

  if (!pronto) {
    return <View style={{ alignItems: 'center', backgroundColor: cores.fundo, flex: 1, justifyContent: 'center' }}><ActivityIndicator color={cores.branco} size="large" /></View>;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
