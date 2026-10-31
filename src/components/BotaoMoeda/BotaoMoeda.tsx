// Botão reutilizável para selecionar a moeda de exibição.
import { Text, Pressable } from 'react-native';
import { estilos } from './BotaoMoeda.style';

type BotaoMoedaProps = {
  codigoMoeda: string;
  aoTrocar: () => void;
};

function BotaoMoeda({ codigoMoeda, aoTrocar }: BotaoMoedaProps) {
  return (
    <Pressable style={estilos.botao} onPress={aoTrocar}>
      <Text style={estilos.texto}>
        {codigoMoeda === 'BRL' ? 'Ver em US$' : 'Ver em R$'}
      </Text>
    </Pressable>
  );
}

export default BotaoMoeda;
