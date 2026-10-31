// Funções de apresentação para preços e variações no padrão brasileiro.
export function formatarPreco(valor: number, codigoMoeda: string) {
  const simbolo = codigoMoeda === 'BRL' ? 'R$' : 'US$';
  const numero = valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${simbolo} ${numero}`;
}

export function formatarVariacao(valor: number) {
  const sinal = valor >= 0 ? '+' : '';
  const numero = valor.toFixed(2).replace('.', ',');
  return `${sinal}${numero}%`;
}
