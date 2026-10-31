// Estilos do painel branco que contém a lista principal.
import { StyleSheet } from 'react-native';
import { cores } from '../../estilos/global';

export const estilos = StyleSheet.create({
  painel: {
    flex: 1,
    backgroundColor: cores.branco,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  alca: {
    width: 46,
    height: 5,
    borderRadius: 3,
    backgroundColor: cores.borda,
    alignSelf: 'center',
    marginBottom: 12,
  },
});
