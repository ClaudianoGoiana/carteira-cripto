# Arquitetura

## Visão geral

O Valor Cripto é um aplicativo React Native multiplataforma. O Expo Router transforma os arquivos de `src/app` em rotas e o módulo `src/db.ts` esconde a diferença entre armazenamento nativo e web.

```text
Tela Expo Router
    |
    +-- componentes visuais
    |
    +-- src/api.ts ---------------- APIs públicas de cotação
    |
    +-- src/db.ts ----------------- fachada de persistência
            |
            +-- db.native.ts ------ expo-sqlite (Android/iOS)
            +-- db.web.ts ---------- localStorage (web)
```

## Rotas

| Rota | Responsabilidade |
|---|---|
| `/entrar` | Autenticação local |
| `/criar-conta` | Criação de usuário |
| `/` | Cotações e favoritos |
| `/carteira` | Saldo e compras fictícias |
| `/favoritos` | Lista e exclusão confirmada |
| `/perfil` | Dados pessoais, CPF e resumo de investimento |

## Decisões

1. **Expo Router:** rotas por arquivo e navegação simples.
2. **Fachada de banco:** telas não conhecem SQL nem `localStorage`.
3. **Tipos compartilhados:** contratos como `Perfil`, `Carteira` e `Favorito` ficam expostos por `db.ts`.
4. **Persistência local:** permite testes offline e execução imediata no Expo Go.
5. **Preços fictícios da carteira:** compras usam valores fixos para tornar a demonstração determinística.

## Fluxo de autenticação

1. O layout inicializa o armazenamento.
2. As telas internas consultam a sessão.
3. Usuário não autenticado é redirecionado para `/entrar`.
4. Login grava apenas o identificador da sessão.
5. Logout remove a sessão.

## Fluxo de compra

1. Usuário escolhe Bitcoin ou Ethereum.
2. Digita um valor em reais.
3. O banco valida valor positivo e saldo suficiente.
4. O saldo é decrementado.
5. A quantidade adquirida e o histórico são gravados.
