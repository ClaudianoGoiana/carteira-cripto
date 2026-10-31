# Banco de dados

## SQLite nativo

No Android e iOS, o arquivo `valor-cripto.db` é aberto por `expo-sqlite`. As tabelas são criadas na inicialização e colunas novas são adicionadas por migração idempotente.

### Tabelas

| Tabela | Campos principais | Finalidade |
|---|---|---|
| `usuarios` | `id`, `nome`, `sobrenome`, `email`, `senha_hash`, `cpf`, dados de contato | Conta e perfil |
| `sessao` | `id`, `usuario_id` | Sessão ativa local |
| `carteiras` | `usuario_id`, `saldo`, `bitcoin`, `ethereum` | Posição fictícia |
| `compras` | `usuario_id`, `moeda`, `valor`, `quantidade`, `criada_em` | Histórico |
| `favoritos` | `usuario_id`, `moeda_id`, nome, símbolo, imagem | Moedas salvas |

## Adaptador web

O navegador não usa o worker WASM do SQLite. Para manter a demonstração executável no web, `db.web.ts` usa chaves separadas no `localStorage`.

Chaves:

- `valor-cripto-usuarios`
- `valor-cripto-sessao`
- `valor-cripto-carteiras`
- `valor-cripto-compras`
- `valor-cripto-favoritos`

## Regras de integridade

- E-mail é único.
- Favorito é único por usuário e moeda.
- CPF confirmado não pode ser alterado.
- Compra exige saldo suficiente.
- Toda consulta de carteira, compra ou favorito exige sessão.
