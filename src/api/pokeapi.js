import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://pokeapi.co/api/v2';
const CACHE_PREFIX = '@pokedex:';

export const SPRITE_URL = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export function extractIdFromUrl(url) {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}

async function readCache(key) {
  try {
    const raw = await AsyncStorage.getItem(CACHE_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function writeCache(key, value) {
  try {
    await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore cache write failures
  }
}

// Network-first with cache fallback: tries the API, falls back to cache when offline.
async function fetchWithCache(key, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    writeCache(key, data);
    return data;
  } catch (err) {
    const cached = await readCache(key);
    if (cached) return cached;
    throw err;
  }
}

export async function fetchPokemonPage(offset = 0, limit = 20) {
  const data = await fetchWithCache(
    `list:${offset}:${limit}`,
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );
  const items = data.results.map((r) => {
    const id = extractIdFromUrl(r.url);
    return { id, name: r.name, sprite: SPRITE_URL(id) };
  });
  return { items, total: data.count, next: data.next };
}

// One-shot fetch of all names for client-side search. PokeAPI has ~1300 entries.
export async function fetchAllNames() {
  const data = await fetchWithCache(
    'all-names',
    `${BASE_URL}/pokemon?limit=100000&offset=0`
  );
  return data.results.map((r) => {
    const id = extractIdFromUrl(r.url);
    return { id, name: r.name, sprite: SPRITE_URL(id) };
  });
}

export async function fetchPokemonDetail(nameOrId) {
  const data = await fetchWithCache(
    `detail:${nameOrId}`,
    `${BASE_URL}/pokemon/${nameOrId}`
  );
  return {
    id: data.id,
    name: data.name,
    sprite:
      data.sprites?.other?.['official-artwork']?.front_default ||
      SPRITE_URL(data.id),
    types: data.types.map((t) => t.type.name),
    abilities: data.abilities.map((a) => ({
      name: a.ability.name,
      isHidden: a.is_hidden,
    })),
  };
}
