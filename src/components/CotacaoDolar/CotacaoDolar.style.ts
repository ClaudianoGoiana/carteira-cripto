// Estilos do cartão de cotação do dólar.
import { StyleSheet } from 'react-native';
import { cores } from '../../estilos/global';

export const estilos = StyleSheet.create({
  topo: {
    alignItems: 'center',
    paddingTop: 72,
    paddingBottom: 34,
  },
  rotulo: {
    fontSize: 13,
    color: cores.textoClaro,
  },
  cotacao: {
    fontSize: 40,
    fontWeight: 'bold',
    color: cores.branco,
    marginTop: 6,
  },
  aviso: {
    fontSize: 15,
    color: cores.textoClaro,
    marginTop: 10,
  },
  etiquetas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  etiqueta: {
    backgroundColor: cores.superficie,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  alta: {
    fontSize: 12,
    color: cores.branco,
  },
  baixa: {
    fontSize: 12,
    color: cores.textoClaro,
  },
});
