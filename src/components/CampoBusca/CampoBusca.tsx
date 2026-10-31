// Campo controlado usado para filtrar a lista de cotações.
import { View, Text, TextInput } from 'react-native';
import { estilos } from './CampoBusca.style';

type CampoBuscaProps = {
  valor: string;
  aoMudar: (texto: string) => void;
};

function CampoBusca({ valor, aoMudar }: CampoBuscaProps) {
  return (
    <View style={estilos.campo}>
      <Text style={estilos.lupa}>⌕</Text>
      <TextInput
        style={estilos.entrada}
        value={valor}
        onChangeText={aoMudar}
        placeholder="Busque a moeda que você quer"
        placeholderTextColor="#000000"
      />
    </View>
  );
}

export default CampoBusca;
