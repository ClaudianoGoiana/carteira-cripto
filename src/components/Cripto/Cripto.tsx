// Apresenta preço, variação e ação de favorito de uma moeda.
import { Image, Pressable, Text, View } from 'react-native';
import { formatarPreco, formatarVariacao } from '../../formato';
import { estilos } from './Cripto.style';

type CriptoProps = {
  nome: string;
  simbolo: string;
  imagem: string;
  preco: number;
  codigoMoeda: string;
  variacao: number;
  favorito: boolean;
  aoAlternarFavorito: () => void;
};

export default function Cripto({ nome, simbolo, imagem, preco, codigoMoeda, variacao, favorito, aoAlternarFavorito }: CriptoProps) {
  return (
    <View style={estilos.linha}>
      <Image source={{ uri: imagem }} style={estilos.logo} />

      <View style={estilos.identificacao}>
        <Text style={estilos.nome}>{nome}</Text>
        <Text style={estilos.simbolo}>{simbolo.toUpperCase()}</Text>
      </View>

      <View style={estilos.valores}>
        <Text style={estilos.preco}>{formatarPreco(preco, codigoMoeda)}</Text>
        <Text style={variacao >= 0 ? estilos.alta : estilos.baixa}>
          {formatarVariacao(variacao)}
        </Text>
      </View>
      <Pressable accessibilityLabel={favorito ? `Remover ${nome} dos favoritos` : `Adicionar ${nome} aos favoritos`} onPress={aoAlternarFavorito}>
        <Text style={{ color: favorito ? '#f59e0b' : '#9aa5b5', fontSize: 24 }}>{favorito ? '★' : '☆'}</Text>
      </Pressable>
    </View>
  );
}
