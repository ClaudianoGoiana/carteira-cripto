// Tela de posição fictícia, compras simuladas e histórico do investidor.
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { comprar, listarCompras, obterCarteira, Compra, Carteira } from '../db';
import { cores } from '../estilos/global';

const precos = { bitcoin: 421252, ethereum: 12236.83 };

export default function CarteiraScreen() {
  const [carteira, setCarteira] = useState<Carteira | null>(null);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [moeda, setMoeda] = useState<'bitcoin' | 'ethereum'>('bitcoin');
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    try {
      setCarteira(await obterCarteira());
      setCompras(await listarCompras());
    } catch {
      router.replace('/entrar');
    }
  }, []);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  async function realizarCompra() {
    setErro('');
    try {
      await comprar(moeda, Number(valor.replace(',', '.')), precos[moeda]);
      setValor('');
      await carregar();
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível concluir a compra.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.tela}>
      <View style={styles.topo}>
        <Text style={styles.titulo}>Minha carteira</Text>
        <Pressable onPress={() => router.replace('/')}><Text style={styles.voltar}>Cotações</Text></Pressable>
      </View>
      <View style={styles.saldo}>
        <Text style={styles.rotulo}>Saldo fictício disponível</Text>
        <Text style={styles.valor}>R$ {(carteira?.saldo ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
      </View>
      <View style={styles.holdings}>
        <Text style={styles.secaoClaro}>Ativos</Text>
        <Text style={styles.item}>Bitcoin: {(carteira?.bitcoin ?? 0).toFixed(8)} BTC</Text>
        <Text style={styles.item}>Ethereum: {(carteira?.ethereum ?? 0).toFixed(6)} ETH</Text>
      </View>
      <View style={styles.compra}>
        <Text style={styles.secao}>Comprar moeda fictícia</Text>
        <View style={styles.escolhas}>
          {(['bitcoin', 'ethereum'] as const).map((item) => (
            <Pressable key={item} onPress={() => setMoeda(item)} style={[styles.escolha, moeda === item && styles.escolhaAtiva]}>
              <Text style={moeda === item ? styles.escolhaTextoAtiva : styles.escolhaTexto}>{item === 'bitcoin' ? 'Bitcoin' : 'Ethereum'}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput keyboardType="decimal-pad" placeholder="Valor em R$ (ex.: 100)" placeholderTextColor="#000000" style={styles.input} value={valor} onChangeText={setValor} />
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        <Pressable onPress={realizarCompra} style={styles.botao}><Text style={styles.botaoTexto}>Confirmar compra</Text></Pressable>
      </View>
      <Text style={styles.secao}>Últimas compras</Text>
      {compras.length === 0 ? <Text style={styles.vazio}>Nenhuma compra realizada.</Text> : compras.map((compra, index) => (
        <View key={`${compra.criadaEm}-${index}`} style={styles.historico}>
          <Text style={styles.item}>{compra.moeda === 'bitcoin' ? 'Bitcoin' : 'Ethereum'}</Text>
          <Text style={styles.detalhe}>R$ {compra.valor.toFixed(2)} • {compra.quantidade.toFixed(8)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { backgroundColor: cores.fundo, flexGrow: 1, padding: 24 },
  topo: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 32 },
  titulo: { color: cores.branco, fontSize: 28, fontWeight: '700' },
  voltar: { color: cores.textoClaro, fontWeight: '700' },
  saldo: { backgroundColor: cores.branco, borderRadius: 16, marginTop: 24, padding: 20 },
  rotulo: { color: cores.textoFraco },
  valor: { color: cores.texto, fontSize: 28, fontWeight: '700', marginTop: 8 },
  holdings: { backgroundColor: cores.superficie, borderRadius: 16, marginTop: 16, padding: 20 },
  compra: { backgroundColor: cores.branco, borderRadius: 16, marginVertical: 16, padding: 20 },
  secao: { color: cores.texto, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  secaoClaro: { color: cores.branco, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  item: { color: cores.texto, fontSize: 16, marginBottom: 8 },
  escolhas: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  escolha: { borderColor: cores.borda, borderRadius: 10, borderWidth: 1, flex: 1, padding: 12 },
  escolhaAtiva: { backgroundColor: cores.fundo, borderColor: cores.fundo },
  escolhaTexto: { color: cores.texto, textAlign: 'center' },
  escolhaTextoAtiva: { color: cores.branco, fontWeight: '700', textAlign: 'center' },
  input: { backgroundColor: cores.campo, borderRadius: 10, color: cores.texto, padding: 14 },
  erro: { color: '#b42318', marginTop: 8 },
  botao: { backgroundColor: cores.fundo, borderRadius: 10, marginTop: 12, padding: 14 },
  botaoTexto: { color: cores.branco, fontWeight: '700', textAlign: 'center' },
  historico: { backgroundColor: cores.branco, borderRadius: 10, marginBottom: 8, padding: 14 },
  detalhe: { color: cores.textoFraco },
  vazio: { color: cores.textoClaro },
});
