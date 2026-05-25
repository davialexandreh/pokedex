# Pokédex — Teste Técnico React Native

Aplicativo simples em React Native que consome a [PokeAPI](https://pokeapi.co/) e exibe uma lista de pokémons, com busca por nome e tela de detalhes.

## Stack

- **Expo (SDK 54)** + **React Native 0.81** — workflow gerenciado, roda no celular via Expo Go
- **JavaScript** (sem TypeScript, mantendo simples)
- **React Navigation 7** (`native-stack`) para a navegação entre as duas telas
- **fetch** nativo para HTTP
- **AsyncStorage** para cache local
- **`useColorScheme`** do RN para dark mode automático (segue o tema do sistema)

## Funcionalidades

### Requisitos
- Tela inicial listando pokémons (imagem, nome e ID)
- Campo de busca por nome
- Tela de detalhes com nome, ID, imagem, tipo e habilidades

### Extras implementados
- **Scroll infinito** — paginação de 20 em 20 via `FlatList.onEndReached`
- **Dark mode** automático conforme tema do sistema
- **Cache local** com AsyncStorage (estratégia *network-first* com *cache fallback*: usa a rede e, se falhar, serve o que tiver em cache — funciona offline depois da primeira carga)

## Estrutura

```
pokedex/
├── App.js                          # NavigationContainer + tema
├── index.js
├── src/
│   ├── api/
│   │   └── pokeapi.js              # fetch + cache + helpers
│   ├── components/
│   │   ├── PokemonCard.js          # card da lista
│   │   └── SearchBar.js            # input de busca
│   ├── screens/
│   │   ├── HomeScreen.js           # lista + busca + scroll infinito
│   │   └── DetailsScreen.js        # detalhes do pokémon
│   └── theme/
│       ├── colors.js               # paletas light/dark + cores por tipo
│       └── useTheme.js             # hook que devolve a paleta ativa
└── package.json
```

## Como rodar

### Pré-requisitos
- **Node.js 18+** (recomendado 20 ou superior)
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

O Metro Bundler vai abrir uma página no terminal/navegador com um QR Code.

- **No celular**: abra o Expo Go e escaneie o QR Code (Android via app; iOS pela câmera).
- **No simulador iOS**: pressione `i` no terminal.
- **No emulador Android**: pressione `a` no terminal.

## Detalhes de implementação

### Busca
A PokeAPI não oferece busca parcial pelo nome. A solução foi puxar uma vez a lista completa de nomes (`/pokemon?limit=100000`) e filtrar no cliente. A primeira chamada é cacheada — chamadas seguintes vêm do AsyncStorage.

Enquanto a lista completa não chega, a busca filtra apenas o que já foi paginado.

### Cache
Cada requisição é gravada no AsyncStorage com a chave `@pokedex:<chave>`. Em caso de falha de rede, a função `fetchWithCache` retorna o último valor cacheado em vez de lançar erro.

### Dark mode
Sem libs de tema. `useColorScheme()` retorna `'light'` ou `'dark'` conforme as preferências do sistema; o hook `useTheme()` escolhe a paleta correta. O `NavigationContainer` recebe o tema do React Navigation para o header também respeitar.
