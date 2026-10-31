# Segurança e limitações

## Estado atual

- O armazenamento é local.
- A senha não é salva em texto puro.
- O CPF é salvo localmente após validação.
- A confirmação de CPF é simulada localmente.
- Não existe servidor de autenticação ou autorização remota.

## Não usar em produção financeira

Este projeto é um protótipo acadêmico. Para produção, é necessário:

1. Backend com autenticação por token e controle de sessão.
2. Hash de senha com Argon2id, bcrypt ou scrypt e salt.
3. Cofre seguro para tokens e dados sensíveis.
4. API real de KYC/CPF com consentimento e auditoria.
5. Criptografia de dados pessoais em repouso e em trânsito.
6. Rate limiting, MFA, logs e monitoramento.
7. Conformidade com LGPD e regras aplicáveis ao serviço financeiro.
8. Corretora ou custodiante regulamentada para ordens reais.

## Dados sensíveis

Não compartilhe banco local, logs, tokens, credenciais ou CPF em commits, issues ou screenshots.
