// Estilos de uma linha de criptomoeda.
import { StyleSheet } from 'react-native';
import { cores } from '../../estilos/global';

export const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: cores.campo,
  },
  identificacao: {
    flex: 1,
    marginLeft: 10,
  },
  nome: {
    fontSize: 11,
    color: cores.textoFraco,
  },
  simbolo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: cores.texto,
  },
  valores: {
    alignItems: 'flex-end',
  },
  preco: {
    fontSize: 15,
    fontWeight: 'bold',
    color: cores.texto,
  },
  alta: {
    fontSize: 12,
    color: cores.alta,
    marginTop: 2,
  },
  baixa: {
    fontSize: 12,
    color: cores.baixa,
    marginTop: 2,
  },
});
