# Operação e build

## Desenvolvimento

```bash
npm install
npx expo start
```

## APK de teste

O projeto usa EAS Build. O fluxo exige login Expo, projeto vinculado e Git:

```bash
git init
npx eas login
npx eas init --account <conta>
npx eas build --platform android --profile preview
```

`eas.json` define `distribution: internal` e `buildType: apk`.

## Identidade Android

- Pacote: `com.claudianogoiana.modelocripto`
- Ícone: `assets/images/valor-cripto-icon.png`
- Fonte vetorial: `assets/valor-cripto-icon.svg`

## Checklist antes de publicar

- Executar TypeScript e lint.
- Testar login, carteira, favoritos e perfil.
- Configurar API real e variáveis de ambiente.
- Remover dados e preços fictícios.
- Revisar permissões Android.
- Validar política de privacidade e LGPD.
