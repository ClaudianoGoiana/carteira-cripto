// Busca e apresenta o dólar comercial na moeda selecionada.
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import BotaoMoeda from '../BotaoMoeda/BotaoMoeda';
import { buscarDolar, Dolar } from '../../api';
import { formatarPreco, formatarVariacao } from '../../formato';
import { cores } from '../../estilos/global';
import { estilos } from './CotacaoDolar.style';

type CotacaoDolarProps = {
  codigoMoeda: string;
  aoTrocar: () => void;
};

function CotacaoDolar({ codigoMoeda, aoTrocar }: CotacaoDolarProps) {
  const [dolar, setDolar] = useState<Dolar | null>(null);
  const [erro, setErro] = useState('');

  // Busca a cotação do dólar quando o componente aparece.
  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarDolar();
        setDolar(dados);
      } catch {
        setErro('Não foi possível carregar a cotação.');
      }
    }

    carregar();
  }, []);

  return (
    <View style={estilos.topo}>
      <Text style={estilos.rotulo}>Valor do Dólar</Text>

      {erro.length > 0 ? (
        <Text style={estilos.aviso}>{erro}</Text>
      ) : dolar === null ? (
        <ActivityIndicator size="small" color={cores.branco} />
      ) : (
        <>
          <Text style={estilos.cotacao}>{formatarPreco(Number(dolar.bid), 'BRL')}</Text>

          <View style={estilos.etiquetas}>
            <View style={estilos.etiqueta}>
              <Text style={dolar.pctChange === null || Number.isNaN(Number(dolar.pctChange)) ? estilos.baixa : Number(dolar.pctChange) >= 0 ? estilos.alta : estilos.baixa}>
                {dolar.pctChange === null || Number.isNaN(Number(dolar.pctChange))
                  ? 'Variação indisponível'
                  : `Hoje ${formatarVariacao(Number(dolar.pctChange))}`}
              </Text>
            </View>

            <BotaoMoeda codigoMoeda={codigoMoeda} aoTrocar={aoTrocar} />
          </View>
        </>
      )}
    </View>
  );
}

export default CotacaoDolar;
