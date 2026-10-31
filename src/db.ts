// Fachada que escolhe o adaptador de persistência conforme a plataforma.
import { Platform } from 'react-native';

type ModuloBanco = typeof import('./db.native');
export type Carteira = { saldo: number; bitcoin: number; ethereum: number };
export type Compra = { moeda: string; valor: number; quantidade: number; criadaEm: string };
export type Favorito = { moedaId: string; nome: string; simbolo: string; imagem: string };
export type ResumoInvestimento = {
  saldo: number;
  investido: number;
  patrimonio: number;
  compras: number;
  favoritos: number;
};
export type Perfil = {
  id: number; nome: string; sobrenome: string; email: string; cpf: string | null;
  cpfConfirmado: boolean; telefone: string; dataNascimento: string; endereco: string;
};

async function modulo(): Promise<ModuloBanco> {
  return Platform.OS === 'web' ? import('./db.web') : import('./db.native');
}

export async function inicializarBanco() { return (await modulo()).inicializarBanco(); }
export async function criarUsuario(nome: string, email: string, senha: string) {
  return (await modulo()).criarUsuario(nome, email, senha);
}
export async function entrar(email: string, senha: string) {
  return (await modulo()).entrar(email, senha);
}
export async function obterSessao() { return (await modulo()).obterSessao(); }
export async function sair() { return (await modulo()).sair(); }
export async function atualizarPerfil(perfil: Pick<Perfil, 'nome' | 'sobrenome' | 'email' | 'telefone' | 'dataNascimento' | 'endereco'>) {
  return (await modulo()).atualizarPerfil(perfil);
}
export async function obterPerfil() { return (await modulo()).obterPerfil(); }
export async function confirmarCpf(cpf: string) { return (await modulo()).confirmarCpf(cpf); }
export async function obterCarteira() { return (await modulo()).obterCarteira(); }
export async function comprar(moeda: 'bitcoin' | 'ethereum', valor: number, preco: number) {
  return (await modulo()).comprar(moeda, valor, preco);
}
export async function listarCompras() { return (await modulo()).listarCompras(); }
export async function listarFavoritos() { return (await modulo()).listarFavoritos(); }
export async function salvarFavorito(favorito: Favorito) { return (await modulo()).salvarFavorito(favorito); }
export async function removerFavorito(moedaId: string) { return (await modulo()).removerFavorito(moedaId); }
export async function obterResumoInvestimento() { return (await modulo()).obterResumoInvestimento(); }
