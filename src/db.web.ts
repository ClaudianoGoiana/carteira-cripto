// Adaptador web do mesmo contrato do SQLite, usando localStorage.
import * as Crypto from 'expo-crypto';

export type Perfil = {
  id: number; nome: string; sobrenome: string; email: string; cpf: string | null;
  cpfConfirmado: boolean; telefone: string; dataNascimento: string; endereco: string; senhaHash?: string;
};
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
const chaveUsuarios = 'valor-cripto-usuarios';
const chaveSessao = 'valor-cripto-sessao';
const chaveCarteiras = 'valor-cripto-carteiras';
const chaveCompras = 'valor-cripto-compras';
const chaveFavoritos = 'valor-cripto-favoritos';

async function hashSenha(senha: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `valor-cripto:${senha}`);
}

function usuarios(): Perfil[] {
  const lista = JSON.parse(localStorage.getItem(chaveUsuarios) ?? '[]') as Partial<Perfil>[];
  return lista.map((usuario) => ({
    id: usuario.id ?? Date.now(),
    nome: usuario.nome ?? '',
    sobrenome: usuario.sobrenome ?? '',
    email: usuario.email ?? '',
    cpf: usuario.cpf ?? null,
    cpfConfirmado: usuario.cpfConfirmado ?? false,
    telefone: usuario.telefone ?? '',
    dataNascimento: usuario.dataNascimento ?? '',
    endereco: usuario.endereco ?? '',
    senhaHash: usuario.senhaHash,
  }));
}

export async function inicializarBanco() {}

export async function criarUsuario(nome: string, email: string, senha: string) {
  const lista = usuarios();
  const normalizado = email.trim().toLowerCase();
  if (lista.some((usuario) => usuario.email === normalizado)) throw new Error('E-mail já cadastrado.');
  lista.push({ id: Date.now(), nome: nome.trim(), sobrenome: '', email: normalizado, cpf: null, cpfConfirmado: false, telefone: '', dataNascimento: '', endereco: '', senhaHash: await hashSenha(senha) });
  localStorage.setItem(chaveUsuarios, JSON.stringify(lista));
}

export async function entrar(email: string, senha: string) {
  const usuario = usuarios().find((item) => item.email === email.trim().toLowerCase());
  if (!usuario || usuario.senhaHash !== await hashSenha(senha)) throw new Error('E-mail ou senha inválidos.');
  localStorage.setItem(chaveSessao, String(usuario.id));
  return obterPerfil();
}

export async function obterSessao() {
  return obterPerfil();
}

export async function obterPerfil() {
  const id = Number(localStorage.getItem(chaveSessao));
  const usuario = usuarios().find((item) => item.id === id);
  return usuario ? { ...usuario, senhaHash: undefined } : null;
}

export async function sair() { localStorage.removeItem(chaveSessao); }

export async function atualizarPerfil(perfil: Pick<Perfil, 'nome' | 'sobrenome' | 'email' | 'telefone' | 'dataNascimento' | 'endereco'>) {
  const id = usuarioId();
  const lista = usuarios();
  const normalizado = perfil.email.trim().toLowerCase();
  if (lista.some((item) => item.email === normalizado && item.id !== id)) throw new Error('Este e-mail já está em uso.');
  const usuario = lista.find((item) => item.id === id);
  if (!usuario) throw new Error('Sessão expirada.');
  usuario.nome = perfil.nome.trim();
  usuario.sobrenome = perfil.sobrenome.trim();
  usuario.email = normalizado;
  usuario.telefone = perfil.telefone.trim();
  usuario.dataNascimento = perfil.dataNascimento.trim();
  usuario.endereco = perfil.endereco.trim();
  localStorage.setItem(chaveUsuarios, JSON.stringify(lista));
  return obterPerfil();
}

export async function confirmarCpf(cpf: string) {
  const id = usuarioId();
  const lista = usuarios();
  const usuario = lista.find((item) => item.id === id);
  if (!usuario) throw new Error('Sessão expirada.');
  if (usuario.cpfConfirmado) throw new Error('O CPF já foi confirmado e não pode ser alterado.');
  const limpo = cpf.replace(/\D/g, '');
  if (!validarCpf(limpo)) throw new Error('CPF inválido.');
  usuario.cpf = limpo;
  usuario.cpfConfirmado = true;
  localStorage.setItem(chaveUsuarios, JSON.stringify(lista));
  return obterPerfil();
}

function validarCpf(cpf: string) {
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(cpf[i]) * (10 - i);
  let digito = (soma * 10) % 11;
  if (digito === 10) digito = 0;
  if (digito !== Number(cpf[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(cpf[i]) * (11 - i);
  digito = (soma * 10) % 11;
  if (digito === 10) digito = 0;
  return digito === Number(cpf[10]);
}

function usuarioId() {
  const id = Number(localStorage.getItem(chaveSessao));
  if (!id) throw new Error('Faça login para acessar sua carteira.');
  return id;
}

function carteiras(): Record<string, Carteira> {
  return JSON.parse(localStorage.getItem(chaveCarteiras) ?? '{}') as Record<string, Carteira>;
}

export async function obterCarteira() {
  const id = usuarioId();
  const lista = carteiras();
  lista[id] ??= { saldo: 10000, bitcoin: 0, ethereum: 0 };
  localStorage.setItem(chaveCarteiras, JSON.stringify(lista));
  return lista[id];
}

export async function comprar(moeda: 'bitcoin' | 'ethereum', valor: number, preco: number) {
  if (!Number.isFinite(valor) || valor <= 0) throw new Error('Informe um valor válido.');
  const id = usuarioId();
  const carteira = await obterCarteira();
  if (carteira.saldo < valor) throw new Error('Saldo fictício insuficiente.');
  carteira.saldo -= valor;
  carteira[moeda] += valor / preco;
  const lista = carteiras();
  lista[id] = carteira;
  localStorage.setItem(chaveCarteiras, JSON.stringify(lista));
  const compras = JSON.parse(localStorage.getItem(chaveCompras) ?? '{}') as Record<string, Compra[]>;
  compras[id] ??= [];
  compras[id].unshift({ moeda, valor, quantidade: valor / preco, criadaEm: new Date().toISOString() });
  localStorage.setItem(chaveCompras, JSON.stringify(compras));
}

export async function listarCompras() {
  const id = usuarioId();
  const compras = JSON.parse(localStorage.getItem(chaveCompras) ?? '{}') as Record<string, Compra[]>;
  return compras[id] ?? [];
}

export async function listarFavoritos() {
  const id = usuarioId();
  const favoritos = JSON.parse(localStorage.getItem(chaveFavoritos) ?? '{}') as Record<string, Favorito[]>;
  return favoritos[id] ?? [];
}

export async function salvarFavorito(favorito: Favorito) {
  const id = usuarioId();
  const favoritos = JSON.parse(localStorage.getItem(chaveFavoritos) ?? '{}') as Record<string, Favorito[]>;
  favoritos[id] ??= [];
  favoritos[id] = [...favoritos[id].filter((item) => item.moedaId !== favorito.moedaId), favorito];
  localStorage.setItem(chaveFavoritos, JSON.stringify(favoritos));
}

export async function removerFavorito(moedaId: string) {
  const id = usuarioId();
  const favoritos = JSON.parse(localStorage.getItem(chaveFavoritos) ?? '{}') as Record<string, Favorito[]>;
  favoritos[id] = (favoritos[id] ?? []).filter((item) => item.moedaId !== moedaId);
  localStorage.setItem(chaveFavoritos, JSON.stringify(favoritos));
}

export async function obterResumoInvestimento(): Promise<ResumoInvestimento> {
  const carteira = await obterCarteira();
  const compras = await listarCompras();
  const favoritos = await listarFavoritos();
  const investido = compras.reduce((total, compra) => total + compra.valor, 0);
  const patrimonio = carteira.saldo + carteira.bitcoin * 421252 + carteira.ethereum * 12236.83;
  return { saldo: carteira.saldo, investido, patrimonio, compras: compras.length, favoritos: favoritos.length };
}
