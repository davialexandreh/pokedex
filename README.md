# Pokédex — React Native

Aplicativo em React Native que consome a [PokeAPI](https://pokeapi.co/) e exibe uma lista de pokémons, com busca por nome e tela de detalhes.

## Stack

- **Expo (SDK 54)** + **React Native 0.81** — workflow gerenciado, roda no celular via Expo Go
- **JavaScript**
- **React Navigation 7** (`native-stack`) para a navegação entre as duas telas
- **fetch** nativo para HTTP
- **AsyncStorage** para cache local
- **`useColorScheme`** do RN para dark mode

## Como rodar

### Pré-requisitos

- **Node.js 18+**
- **npm**
- O app **Expo Go** instalado no celular ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)), **OU** um simulador iOS / emulador Android configurado

### Passos

```bash
# 1. Instalar as dependências
cd pokedex
npm install

# 2. Iniciar o bundler
npm start
```
