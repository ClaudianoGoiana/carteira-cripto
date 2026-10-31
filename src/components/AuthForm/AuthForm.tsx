// Layout compartilhado pelas telas de entrada e cadastro.
import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../../estilos/global';

export default function AuthForm({ children }: PropsWithChildren) {
  return (
    <View style={styles.tela}>
      <Text style={styles.logo}>Valor Cripto</Text>
      <Text style={styles.subtitulo}>Seu mercado de moedas em um só lugar</Text>
      <View style={styles.cartao}>{children}</View>
    </View>
  );
}

export const authStyles = StyleSheet.create({
  titulo: { color: cores.texto, fontSize: 24, fontWeight: '700', marginBottom: 8 },
  texto: { color: cores.textoFraco, marginBottom: 20 },
  campo: {
    backgroundColor: cores.campo,
    borderColor: cores.borda,
    borderRadius: 12,
    borderWidth: 1,
    color: cores.texto,
    marginBottom: 12,
    padding: 14,
  },
  botao: {
    alignItems: 'center',
    backgroundColor: cores.fundo,
    borderRadius: 12,
    marginTop: 8,
    padding: 15,
  },
  botaoTexto: { color: cores.branco, fontWeight: '700' },
  link: { color: cores.fundo, marginTop: 18, textAlign: 'center' },
  erro: { color: '#b42318', marginBottom: 10 },
});

const styles = StyleSheet.create({
  tela: { backgroundColor: cores.fundo, flex: 1, justifyContent: 'center', padding: 24 },
  logo: { color: cores.branco, fontSize: 32, fontWeight: '800', textAlign: 'center' },
  subtitulo: { color: cores.textoClaro, marginBottom: 28, textAlign: 'center' },
  cartao: { backgroundColor: cores.branco, borderRadius: 20, padding: 22 },
});
