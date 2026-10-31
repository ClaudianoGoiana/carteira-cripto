# Valor Cripto

Aplicativo educacional de acompanhamento de criptomoedas e simulação de investimentos, desenvolvido com React Native, Expo Router e Expo Go.

> **Importante:** carteira, compras e cotações apresentadas no projeto são para demonstração. O aplicativo não movimenta dinheiro real, não executa ordens em corretoras e não substitui uma plataforma financeira regulamentada.

## Funcionalidades

- Cadastro e login local.
- Sessão persistida no dispositivo.
- Cotações de Bitcoin, Ethereum, Tether, BNB e TRON.
- Cotação do dólar comercial.
- Busca de moedas.
- Favoritos persistidos por usuário, com confirmação antes da exclusão.
- Carteira fictícia com saldo inicial de R$ 10.000,00.
- Compras simuladas de Bitcoin e Ethereum.
- Perfil de investimento com patrimônio estimado.
- Nome, sobrenome, e-mail, telefone, data de nascimento e endereço.
- Validação local de CPF e bloqueio após confirmação.
- Build Android em formato APK pelo EAS.

## Requisitos

- Node.js 20 ou superior.
- npm.
- Expo Go para executar no dispositivo.
- Conta Expo somente para gerar builds EAS.

## Instalação e execução

```bash
npm install
npx expo start
```

No terminal do Expo:

- `a`: abre no emulador Android.
- Escaneie o QR Code pelo Expo Go: executa no celular.
- `w`: abre a versão web.

## Scripts

```bash
npm run web       # inicia a versão web
npx tsc --noEmit  # verifica tipos TypeScript
npm run lint      # executa o ESLint
```

## Build do APK

O perfil de teste está em [eas.json](./eas.json):

```bash
npx eas login
npx eas build --platform android --profile preview
```

O perfil `preview` gera um APK instalável para testes internos. A configuração do projeto e do pacote Android está em [app.json](./app.json).

## Estrutura

```text
src/
  api.ts                 Integrações de cotação.
  db.ts                  Fachada multiplataforma do armazenamento.
  db.native.ts           SQLite para Android e iOS.
  db.web.ts              Adaptador localStorage para navegador.
  app/                   Rotas Expo Router.
  components/            Componentes visuais reutilizáveis.
  estilos/               Tema visual compartilhado.
assets/                  Ícones, splash e imagens.
docs/                    Documentação técnica e operacional.
```

## Documentação

- [Arquitetura](./docs/ARCHITECTURE.md)
- [Banco de dados](./docs/DATABASE.md)
- [Fluxos e requisitos](./docs/REQUIREMENTS.md)
- [Guia de uso](./docs/USER_GUIDE.md)
- [Segurança e limitações](./docs/SECURITY.md)
- [Testes e validação](./docs/TEST_PLAN.md)
- [Operação e build](./docs/BUILD.md)

## Limitações conhecidas

- As APIs públicas de cotação podem falhar por limite, indisponibilidade ou CORS no navegador.
- A confirmação de CPF atual é uma validação local de dígitos, não uma consulta governamental ou de KYC.
- SHA-256 simples não é política suficiente para autenticação de produção; um backend deve usar Argon2id, bcrypt ou scrypt com salt.
- Dados locais podem ser perdidos ao limpar o aplicativo ou o armazenamento do navegador.
