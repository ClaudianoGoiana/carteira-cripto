// Contêiner visual reutilizável para conteúdo sobre o fundo azul.
import { ReactNode } from 'react';
import { View } from 'react-native';
import { estilos } from './Painel.style';

type PainelProps = {
  children: ReactNode;
};

function Painel({ children }: PainelProps) {
  return (
    <View style={estilos.painel}>
      <View style={estilos.alca} />
      {children}
    </View>
  );
}

export default Painel;
