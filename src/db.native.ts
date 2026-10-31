// Persistência SQLite para Android e iOS, incluindo migrações locais.
import * as Crypto from 'expo-crypto';
import * as SQLite from 'expo-sqlite';

export type Perfil = {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string | null;
  cpfConfirmado: boolean;
  telefone: string;
  dataNascimento: string;
  endereco: string;
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
let banco: SQLite.SQLiteDatabase | null = null;

async function obterBanco() {
  if (!banco) {
    banco = await SQLite.openDatabaseAsync('valor-cripto.db');
    await banco.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE, senha_hash TEXT NOT NULL, criado_em TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS sessao (id INTEGER PRIMARY KEY CHECK (id = 1), usuario_id INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS carteiras (
        usuario_id INTEGER PRIMARY KEY, saldo REAL NOT NULL, bitcoin REAL NOT NULL DEFAULT 0,
        ethereum REAL NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS compras (
        id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER NOT NULL, moeda TEXT NOT NULL,
        valor REAL NOT NULL, quantidade REAL NOT NULL, criada_em TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS favoritos (
        usuario_id INTEGER NOT NULL, moeda_id TEXT NOT NULL, nome TEXT NOT NULL,
        simbolo TEXT NOT NULL, imagem TEXT NOT NULL, PRIMARY KEY (usuario_id, moeda_id)
      );
    `);
    const colunas = await banco.getAllAsync<{ name: string }>('PRAGMA table_info(usuarios)');
    const existentes = new Set(colunas.map((coluna) => coluna.name));
    const migracoes = [
      ['sobrenome', "ALTER TABLE usuarios ADD COLUMN sobrenome TEXT NOT NULL DEFAULT ''"],
      ['cpf', 'ALTER TABLE usuarios ADD COLUMN cpf TEXT'],
      ['cpf_confirmado', 'ALTER TABLE usuarios ADD COLUMN cpf_confirmado INTEGER NOT NULL DEFAULT 0'],
      ['telefone', "ALTER TABLE usuarios ADD COLUMN telefone TEXT NOT NULL DEFAULT ''"],
      ['data_nascimento', "ALTER TABLE usuarios ADD COLUMN data_nascimento TEXT NOT NULL DEFAULT ''"],
      ['endereco', "ALTER TABLE usuarios ADD COLUMN endereco TEXT NOT NULL DEFAULT ''"],
    ] as const;
    for (const [nome, sql] of migracoes) {
      if (!existentes.has(nome)) await banco.execAsync(sql);
    }
  }
  return banco;
}

async function hashSenha(senha: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `valor-cripto:${senha}`);
}

export async function inicializarBanco() { await obterBanco(); }

export async function criarUsuario(nome: string, email: string, senha: string) {
  const db = await obterBanco();
  await db.runAsync(
    'INSERT INTO usuarios (nome, email, senha_hash, criado_em) VALUES (?, ?, ?, ?)',
    nome.trim(), email.trim().toLowerCase(), await hashSenha(senha), new Date().toISOString()
  );
}

export async function entrar(email: string, senha: string) {
  const db = await obterBanco();
  const usuario = await db.getFirstAsync<Perfil & { senha_hash: string; cpf_confirmado: number }>(
    'SELECT id, nome, sobrenome, email, cpf, cpf_confirmado, telefone, data_nascimento AS dataNascimento, endereco, senha_hash FROM usuarios WHERE email = ?', email.trim().toLowerCase()
  );
  if (!usuario || usuario.senha_hash !== await hashSenha(senha)) throw new Error('E-mail ou senha inválidos.');
  await db.runAsync('INSERT OR REPLACE INTO sessao (id, usuario_id) VALUES (1, ?)', usuario.id);
  return obterPerfil();
}

export async function obterSessao() {
  return obterPerfil();
}

export async function obterPerfil() {
  const db = await obterBanco();
  return db.getFirstAsync<Perfil>(
    `SELECT u.id, u.nome, u.sobrenome, u.email, u.cpf,
      u.cpf_confirmado AS cpfConfirmado, u.telefone,
      u.data_nascimento AS dataNascimento, u.endereco
     FROM usuarios u INNER JOIN sessao s ON s.usuario_id = u.id WHERE s.id = 1`
  );
}

export async function sair() {
  await (await obterBanco()).runAsync('DELETE FROM sessao');
}

export async function atualizarPerfil(perfil: Pick<Perfil, 'nome' | 'sobrenome' | 'email' | 'telefone' | 'dataNascimento' | 'endereco'>) {
  const db = await obterBanco();
  const usuarioId = await usuarioAtual();
  await db.runAsync(
    'UPDATE usuarios SET nome = ?, sobrenome = ?, email = ?, telefone = ?, data_nascimento = ?, endereco = ? WHERE id = ?',
    perfil.nome.trim(), perfil.sobrenome.trim(), perfil.email.trim().toLowerCase(),
    perfil.telefone.trim(), perfil.dataNascimento.trim(), perfil.endereco.trim(), usuarioId
  );
  return obterPerfil();
}

export async function confirmarCpf(cpf: string) {
  const db = await obterBanco();
  const usuarioId = await usuarioAtual();
  const existente = await db.getFirstAsync<{ cpf: string | null; cpfConfirmado: number }>(
    'SELECT cpf, cpf_confirmado AS cpfConfirmado FROM usuarios WHERE id = ?', usuarioId
  );
  if (existente?.cpfConfirmado) throw new Error('O CPF já foi confirmado e não pode ser alterado.');
  const limpo = cpf.replace(/\D/g, '');
  if (!validarCpf(limpo)) throw new Error('CPF inválido.');
  await db.runAsync('UPDATE usuarios SET cpf = ?, cpf_confirmado = 1 WHERE id = ?', limpo, usuarioId);
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

async function usuarioAtual() {
  const sessao = await obterSessao();
  if (!sessao) throw new Error('Faça login para acessar sua carteira.');
  return sessao.id;
}

export async function obterCarteira() {
  const db = await obterBanco();
  const usuarioId = await usuarioAtual();
  await db.runAsync(
    'INSERT OR IGNORE INTO carteiras (usuario_id, saldo) VALUES (?, 10000)',
    usuarioId
  );
  return db.getFirstAsync<Carteira>(
    'SELECT saldo, bitcoin, ethereum FROM carteiras WHERE usuario_id = ?', usuarioId
  );
}

export async function comprar(moeda: 'bitcoin' | 'ethereum', valor: number, preco: number) {
  if (!Number.isFinite(valor) || valor <= 0) throw new Error('Informe um valor válido.');
  const db = await obterBanco();
  const usuarioId = await usuarioAtual();
  const carteira = await obterCarteira();
  if (!carteira || carteira.saldo < valor) throw new Error('Saldo fictício insuficiente.');
  const quantidade = valor / preco;
  await db.runAsync(
    `UPDATE carteiras SET saldo = saldo - ?, ${moeda} = ${moeda} + ? WHERE usuario_id = ?`,
    valor, quantidade, usuarioId
  );
  await db.runAsync(
    'INSERT INTO compras (usuario_id, moeda, valor, quantidade, criada_em) VALUES (?, ?, ?, ?, ?)',
    usuarioId, moeda, valor, quantidade, new Date().toISOString()
  );
}

export async function listarCompras() {
  const db = await obterBanco();
  const usuarioId = await usuarioAtual();
  return db.getAllAsync<Compra>(
    'SELECT moeda, valor, quantidade, criada_em AS criadaEm FROM compras WHERE usuario_id = ? ORDER BY id DESC LIMIT 10',
    usuarioId
  );
}

export async function listarFavoritos() {
  const db = await obterBanco();
  const usuarioId = await usuarioAtual();
  return db.getAllAsync<Favorito>(
    'SELECT moeda_id AS moedaId, nome, simbolo, imagem FROM favoritos WHERE usuario_id = ? ORDER BY nome',
    usuarioId
  );
}

export async function salvarFavorito(favorito: Favorito) {
  const db = await obterBanco();
  const usuarioId = await usuarioAtual();
  await db.runAsync(
    'INSERT OR REPLACE INTO favoritos (usuario_id, moeda_id, nome, simbolo, imagem) VALUES (?, ?, ?, ?, ?)',
    usuarioId, favorito.moedaId, favorito.nome, favorito.simbolo, favorito.imagem
  );
}

export async function removerFavorito(moedaId: string) {
  const db = await obterBanco();
  const usuarioId = await usuarioAtual();
  await db.runAsync('DELETE FROM favoritos WHERE usuario_id = ? AND moeda_id = ?', usuarioId, moedaId);
}

export async function obterResumoInvestimento(): Promise<ResumoInvestimento> {
  const carteira = await obterCarteira();
  if (!carteira) throw new Error('Não foi possível carregar a carteira.');
  const compras = await listarCompras();
  const favoritos = await listarFavoritos();
  const investido = compras.reduce((total, compra) => total + compra.valor, 0);
  const patrimonio = carteira.saldo + carteira.bitcoin * 421252 + carteira.ethereum * 12236.83;
  return { saldo: carteira.saldo, investido, patrimonio, compras: compras.length, favoritos: favoritos.length };
}
