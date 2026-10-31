# Requisitos e fluxos

## Requisitos funcionais

| ID | Requisito | Critério de aceite |
|---|---|---|
| RF-01 | Criar conta | Nome, e-mail e senha válidos criam usuário |
| RF-02 | Entrar | Credenciais válidas abrem a tela de cotações |
| RF-03 | Cotação | Lista apresenta moedas e variação quando a API responde |
| RF-04 | Favoritar | Estrela adiciona ou remove a moeda do usuário |
| RF-05 | Excluir favorito | Sistema pergunta antes de excluir e mostra confirmação |
| RF-06 | Carteira | Usuário vê saldo, ativos e histórico |
| RF-07 | Comprar | Valor positivo e saldo suficiente geram compra fictícia |
| RF-08 | Perfil | Usuário edita dados pessoais |
| RF-09 | CPF | CPF válido é confirmado uma vez e fica bloqueado |
| RF-10 | Resumo | Perfil calcula patrimônio, saldo e total investido |

## Regras de negócio

- Saldo inicial fictício: R$ 10.000,00.
- Preço de demonstração: Bitcoin R$ 421.252,00; Ethereum R$ 12.236,83.
- CPF usa validação de dígitos verificadores.
- CPF não é enviado para uma API real nesta versão.
- O patrimônio é estimado usando os preços fictícios da carteira.

## Fluxo de exclusão

1. Usuário toca em `Excluir`.
2. Modal vermelho pergunta: “Você deseja excluir este favorito?”
3. `Cancelar` fecha o modal sem alteração.
4. `Excluir` remove o registro e exibe o aviso de exclusão.
