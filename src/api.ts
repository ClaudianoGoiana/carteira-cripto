// O formato do que cada API devolve.
export type Moeda = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
};

// A API do dólar manda os números como texto — por isso tudo é string aqui.
export type Dolar = {
  bid: string;
  pctChange: string | null;
};

// As moedas que aparecem na lista. Para trocar o app de moedas, é só mexer aqui.
const tokens = ['bitcoin', 'ethereum', 'tether', 'binancecoin', 'tron'];

// Cotação das criptomoedas (CoinGecko, pública e sem chave).
export async function buscarMoedas(codigoMoeda: string) {
  const endereco =
    'https://api.coingecko.com/api/v3/coins/markets' +
    `?vs_currency=${codigoMoeda.toLowerCase()}&ids=${tokens.join(',')}&sparkline=false`;

  const resposta = await fetch(endereco);

  if (!resposta.ok) {
    throw new Error('resposta inválida');
  }

  const dados: Moeda[] = await resposta.json();
  return dados;
}

// Cotação do dólar comercial (AwesomeAPI, pública e sem chave).
export async function buscarDolar() {
  let ultimoErro = 'Nenhuma fonte de cotação respondeu.';

  try {
    const resposta = await fetch('https://economia.awesomeapi.com.br/json/daily/USD-BRL/2');
    if (!resposta.ok) throw new Error('cotação diária indisponível');
    const dados = await resposta.json();
    const cotacoes = Array.isArray(dados) ? dados : [];
    const atual = Number(cotacoes[0]?.bid);
    const anterior = Number(cotacoes[1]?.bid);
    if (!Number.isFinite(atual) || !Number.isFinite(anterior) || anterior === 0) {
      throw new Error('cotação diária inválida');
    }
    const pctChange = ((atual - anterior) / anterior) * 100;
    return { bid: String(atual), pctChange: String(pctChange) };
  } catch (erroDiario) {
    ultimoErro = erroDiario instanceof Error ? erroDiario.message : ultimoErro;
  }

  try {
    const resposta = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
    if (!resposta.ok) throw new Error('AwesomeAPI indisponível');
    const dados = await resposta.json();
    const bid = Number(dados.USDBRL?.bid);
    const pctChange = Number(dados.USDBRL?.pctChange);
    if (!Number.isFinite(bid) || !Number.isFinite(pctChange)) {
      throw new Error('cotação atual inválida');
    }
    return { bid: String(bid), pctChange: String(pctChange) };
  } catch (erroAtual) {
    ultimoErro = erroAtual instanceof Error ? erroAtual.message : ultimoErro;
  }

  try {
    const resposta = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!resposta.ok) throw new Error('API alternativa indisponível');
    const dados = await resposta.json();
    const bid = dados.rates?.BRL;
    if (typeof bid !== 'number') throw new Error('cotação alternativa inválida');
    return { bid: String(bid), pctChange: null };
  } catch {
    throw new Error(`Não foi possível carregar a cotação do dólar: ${ultimoErro}`);
  }
}
