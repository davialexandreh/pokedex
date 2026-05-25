import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PokemonCard from "../components/PokemonCard";
import SearchBar from "../components/SearchBar";
import { fetchAllNames, fetchPokemonPage } from "../api/pokeapi";
import { useTheme } from "../theme/useTheme";

const PAGE_SIZE = 20;

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();

  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [allNames, setAllNames] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);

  const isFetchingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    setLoadingMore(true);
    try {
      const { items: newItems, next } = await fetchPokemonPage(
        offset,
        PAGE_SIZE,
      );
      setItems((prev) => [...prev, ...newItems]);
      setOffset(offset + PAGE_SIZE);
      setHasMore(Boolean(next));
      setError(null);
    } catch (e) {
      setError("Não foi possível carregar a lista.");
    } finally {
      isFetchingRef.current = false;
      setLoadingMore(false);
    }
  }, [offset, hasMore]);

  useEffect(() => {
    loadMore();
    fetchAllNames()
      .then(setAllNames)
      .catch(() => {});
    // intentionally run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const source = allNames.length ? allNames : items;
    return source.filter((p) => p.name.includes(q)).slice(0, 50);
  }, [query, allNames, items]);

  const data = filtered ?? items;

  const renderItem = useCallback(
    ({ item }) => (
      <PokemonCard
        pokemon={item}
        onPress={() =>
          navigation.navigate("Details", { name: item.name, id: item.id })
        }
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item) => String(item.id), []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "left", "right"]}
    >
      <SearchBar value={query} onChangeText={setQuery} />
      {error && items.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: colors.textMuted }}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={filtered ? null : loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loadingMore && !filtered ? (
              <ActivityIndicator color={colors.primary} style={styles.footer} />
            ) : null
          }
          ListEmptyComponent={
            !loadingMore ? (
              <View style={styles.center}>
                <Text style={{ color: colors.textMuted }}>
                  {query ? "Nenhum pokémon encontrado." : "Carregando..."}
                </Text>
              </View>
            ) : null
          }
          contentContainerStyle={data.length === 0 ? styles.flexGrow : null}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  footer: { paddingVertical: 16 },
  flexGrow: { flexGrow: 1 },
});
