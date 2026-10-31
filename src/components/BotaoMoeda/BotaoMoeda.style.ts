// Estilos do botão de alternância de moeda.
import { StyleSheet } from 'react-native';
import { cores } from '../../estilos/global';

export const estilos = StyleSheet.create({
  botao: {
    backgroundColor: cores.branco,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  texto: {
    fontSize: 12,
    fontWeight: 'bold',
    color: cores.fundo,
  },
});
