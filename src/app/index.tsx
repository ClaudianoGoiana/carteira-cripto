// Tela principal: cotações, busca, navegação e controle de favoritos.
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { buscarMoedas, Moeda } from '../api';
import CampoBusca from '../components/CampoBusca/CampoBusca';
import CotacaoDolar from '../components/CotacaoDolar/CotacaoDolar';
import Cripto from '../components/Cripto/Cripto';
import Painel from '../components/Painel/Painel';
import { listarFavoritos, obterSessao, removerFavorito, salvarFavorito } from '../db';
import { cores, global } from '../estilos/global';

export default function Carteira() {
  const [moedas, setMoedas] = useState<Moeda[]>([]);
  const [codigoMoeda, setCodigoMoeda] = useState('BRL');
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [favoritos, setFavoritos] = useState<string[]>([]);

  // Roda quando a tela aparece e de novo a cada troca de moeda.
  useEffect(() => {
    obterSessao().then((sessao) => {
      if (!sessao) router.replace('/entrar');
      else {
        setAutenticado(true);
        listarFavoritos().then((items) => setFavoritos(items.map((item) => item.moedaId))).catch(() => undefined);
      }
    }).catch(() => router.replace('/entrar'));
  }, []);

  useEffect(() => {
    if (!autenticado) return;

    async function carregar() {
      setCarregando(true);
      setErro('');

      try {
        const dados = await buscarMoedas(codigoMoeda);
        setMoedas(dados);
      } catch {
        setErro('Não foi possível carregar as cotações.');
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [autenticado, codigoMoeda]);

  if (!autenticado) {
    return <View style={global.centro}><ActivityIndicator color={cores.fundo} size="large" /></View>;
  }

  const visiveis = moedas.filter((moeda) =>
    moeda.name.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={global.tela}>
      <View style={styles.cabecalho}>
        <CotacaoDolar
          codigoMoeda={codigoMoeda}
          aoTrocar={() => setCodigoMoeda(codigoMoeda === 'BRL' ? 'USD' : 'BRL')}
        />
        <View style={styles.links}>
          <Pressable onPress={() => router.push('/carteira')}><Text style={styles.link}>Carteira</Text></Pressable>
          <Pressable onPress={() => router.push('/favoritos')}><Text style={styles.link}>Favoritos</Text></Pressable>
          <Pressable onPress={() => router.push('/perfil')}><Text style={styles.link}>Perfil</Text></Pressable>
        </View>
      </View>

      <Painel>
        <CampoBusca valor={busca} aoMudar={setBusca} />

        {carregando ? (
          <View style={global.centro}>
            <ActivityIndicator size="large" color={cores.fundo} />
          </View>
        ) : erro.length > 0 ? (
          <View style={global.centro}>
            <Text style={global.erro}>{erro}</Text>
          </View>
        ) : (
          <ScrollView>
            {visiveis.map((moeda) => (
              <Cripto
                key={moeda.id}
                nome={moeda.name}
                simbolo={moeda.symbol}
                imagem={moeda.image}
                preco={moeda.current_price}
                codigoMoeda={codigoMoeda}
                variacao={moeda.price_change_percentage_24h ?? 0}
                favorito={favoritos.includes(moeda.id)}
                aoAlternarFavorito={async () => {
                  if (favoritos.includes(moeda.id)) {
                    await removerFavorito(moeda.id);
                    setFavoritos((atual) => atual.filter((id) => id !== moeda.id));
                  } else {
                    await salvarFavorito({ moedaId: moeda.id, nome: moeda.name, simbolo: moeda.symbol, imagem: moeda.image });
                    setFavoritos((atual) => [...atual, moeda.id]);
                  }
                }}
              />
            ))}
          </ScrollView>
        )}
      </Painel>
    </View>
  );
}

const styles = StyleSheet.create({
  cabecalho: {},
  links: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 8 },
  link: { color: cores.branco, fontWeight: '700' },
});
