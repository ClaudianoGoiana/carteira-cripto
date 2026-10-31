# Plano de testes

## Verificações estáticas

```bash
npx tsc --noEmit
npm run lint
```

## Teste manual principal

1. Criar uma conta.
2. Entrar.
3. Favoritar uma moeda.
4. Abrir Favoritos.
5. Tocar em Excluir e verificar a pergunta vermelha.
6. Cancelar e confirmar que o item permanece.
7. Repetir e confirmar a exclusão.
8. Comprar R$ 100,00 em Bitcoin.
9. Confirmar saldo R$ 9.900,00 e histórico.
10. Editar dados do perfil.
11. Confirmar CPF válido.
12. Verificar que CPF não pode ser alterado.
13. Sair e confirmar redirecionamento ao login.

## Casos negativos

- Login com senha inválida.
- Cadastro com e-mail repetido.
- Compra com valor zero.
- Compra acima do saldo.
- CPF com dígitos inválidos.
- E-mail já usado na edição.
- Exclusão cancelada.

## Limitações do teste web

CoinGecko e AwesomeAPI podem falhar por CORS, limite de requisições ou indisponibilidade. Nesses casos, testar os fluxos locais com dados já persistidos e validar a mensagem de erro da cotação.
