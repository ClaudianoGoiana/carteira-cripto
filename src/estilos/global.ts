// Paleta e estilos base compartilhados por todas as telas.
import { StyleSheet } from 'react-native';

// Paleta única do app — todo componente importa daqui.
export const cores = {
  fundo: '#2563eb',
  superficie: '#4b85f5',
  campo: '#f1f4fa',
  borda: '#e4eaf5',
  texto: '#0f1420',
  textoFraco: '#7d8492',
  textoClaro: '#cfe0ff',
  branco: '#ffffff',
  alta: '#1d4ed8',
  baixa: '#8fa3c7',
};

// Estilos usados por mais de um arquivo.
export const global = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  erro: {
    color: cores.baixa,
    fontSize: 14,
  },
});
