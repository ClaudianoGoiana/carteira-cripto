// Lista favoritos persistidos e exige confirmação antes de removê-los.
import { useCallback, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Favorito, listarFavoritos, removerFavorito } from '../db';
import { cores } from '../estilos/global';

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [aviso, setAviso] = useState('');
  const [favoritoParaExcluir, setFavoritoParaExcluir] = useState<Favorito | null>(null);

  const carregar = useCallback(async () => {
    try {
      setFavoritos(await listarFavoritos());
    } catch {
      router.replace('/entrar');
    }
  }, []);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  async function confirmarExclusao() {
    if (!favoritoParaExcluir) return;
    const favorito = favoritoParaExcluir;
    setFavoritoParaExcluir(null);
    setAviso(`Excluindo ${favorito.nome}...`);
    await removerFavorito(favorito.moedaId);
    setFavoritos((atual) => atual.filter((item) => item.moedaId !== favorito.moedaId));
    setAviso(`${favorito.nome} foi excluído dos favoritos.`);
  }

  return (
    <View style={styles.tela}>
      <View style={styles.topo}>
        <Text style={styles.titulo}>Favoritos</Text>
        <Pressable onPress={() => router.replace('/')}><Text style={styles.voltar}>Cotações</Text></Pressable>
      </View>
      {aviso ? <Text accessibilityLiveRegion="polite" style={styles.aviso}>{aviso}</Text> : null}
      {favoritos.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.texto}>Nenhuma moeda favorita ainda.</Text>
          <Text style={styles.dica}>Toque na estrela de uma cotação para adicioná-la.</Text>
          <Pressable onPress={() => router.replace('/')} style={styles.botao}><Text style={styles.botaoTexto}>Escolher moedas</Text></Pressable>
        </View>
      ) : (
        <ScrollView>
          {favoritos.map((favorito) => (
            <View key={favorito.moedaId} style={styles.item}>
              <Image source={{ uri: favorito.imagem }} style={styles.logo} />
              <View style={styles.identificacao}><Text style={styles.nome}>{favorito.nome}</Text><Text style={styles.simbolo}>{favorito.simbolo.toUpperCase()}</Text></View>
              <Pressable accessibilityLabel={`Excluir ${favorito.nome}`} onPress={() => setFavoritoParaExcluir(favorito)} style={styles.excluir}>
                <Text style={styles.excluirTexto}>Excluir</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
      <Modal
        animationType="fade"
        onRequestClose={() => setFavoritoParaExcluir(null)}
        transparent
        visible={favoritoParaExcluir !== null}
      >
        <View style={styles.fundoModal}>
          <View style={styles.modal}>
            <Text style={styles.pergunta}>Você deseja excluir este favorito?</Text>
            <Text style={styles.confirmacao}>{favoritoParaExcluir?.nome}</Text>
            <View style={styles.acoesModal}>
              <Pressable onPress={() => setFavoritoParaExcluir(null)} style={styles.cancelar}>
                <Text style={styles.cancelarTexto}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={confirmarExclusao} style={styles.confirmar}>
                <Text style={styles.confirmarTexto}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { backgroundColor: cores.fundo, flex: 1, padding: 24 },
  topo: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 32 },
  titulo: { color: cores.branco, fontSize: 28, fontWeight: '700' },
  voltar: { color: cores.textoClaro, fontWeight: '700' },
  aviso: { backgroundColor: '#fff3cd', borderRadius: 10, color: '#664d03', marginTop: 18, padding: 12 },
  vazio: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  texto: { color: cores.branco, fontSize: 18, fontWeight: '700' },
  dica: { color: cores.textoClaro, marginTop: 10, textAlign: 'center' },
  botao: { backgroundColor: cores.branco, borderRadius: 12, marginTop: 24, padding: 15 },
  botaoTexto: { color: cores.fundo, fontWeight: '700' },
  item: { alignItems: 'center', backgroundColor: cores.branco, borderRadius: 14, flexDirection: 'row', marginTop: 14, padding: 14 },
  logo: { height: 38, width: 38 },
  identificacao: { flex: 1, marginLeft: 12 },
  nome: { color: cores.texto, fontSize: 16, fontWeight: '700' },
  simbolo: { color: cores.textoFraco, marginTop: 4 },
  excluir: { borderColor: '#b42318', borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8 },
  excluirTexto: { color: '#b42318', fontWeight: '700' },
  fundoModal: { alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.55)', flex: 1, justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: cores.branco, borderRadius: 16, padding: 24, width: '100%' },
  pergunta: { color: '#b42318', fontSize: 19, fontWeight: '700', textAlign: 'center' },
  confirmacao: { color: cores.textoFraco, marginTop: 10, textAlign: 'center' },
  acoesModal: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelar: { borderColor: cores.borda, borderRadius: 10, borderWidth: 1, flex: 1, padding: 13 },
  cancelarTexto: { color: cores.texto, fontWeight: '700', textAlign: 'center' },
  confirmar: { backgroundColor: '#b42318', borderRadius: 10, flex: 1, padding: 13 },
  confirmarTexto: { color: cores.branco, fontWeight: '700', textAlign: 'center' },
});
