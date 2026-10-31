// Estilos do campo de pesquisa de moedas.
import { StyleSheet } from 'react-native';
import { cores } from '../../estilos/global';

export const estilos = StyleSheet.create({
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.campo,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  lupa: {
    fontSize: 15,
    color: cores.textoFraco,
    marginRight: 8,
  },
  entrada: {
    flex: 1,
    fontSize: 14,
    color: cores.texto,
  },
});
