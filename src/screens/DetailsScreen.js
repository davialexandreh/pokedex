import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { fetchPokemonDetail } from "../api/pokeapi";
import { typeColors } from "../theme/colors";
import { useTheme } from "../theme/useTheme";

const formatId = (id) => `#${String(id).padStart(3, "0")}`;
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function DetailsScreen({ route, navigation }) {
  const { name, id } = route.params;
  const { colors } = useTheme();

  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigation.setOptions({ title: capitalize(name) });
    fetchPokemonDetail(name)
      .then(setDetail)
      .catch(() => setError("Não foi possível carregar os detalhes."));
  }, [name, navigation]);

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textMuted }}>{error}</Text>
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.hero, { backgroundColor: colors.surface }]}>
        <Image source={{ uri: detail.sprite }} style={styles.image} />
        <Text style={[styles.id, { color: colors.textMuted }]}>
          {formatId(detail.id)}
        </Text>
        <Text style={[styles.name, { color: colors.text }]}>
          {capitalize(detail.name)}
        </Text>
      </View>

      <Section title="Tipo" colors={colors}>
        <View style={styles.row}>
          {detail.types.map((t) => (
            <View
              key={t}
              style={[
                styles.typeChip,
                { backgroundColor: typeColors[t] || colors.primary },
              ]}
            >
              <Text style={styles.typeText}>{capitalize(t)}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Habilidades" colors={colors}>
        <View style={styles.col}>
          {detail.abilities.map((a) => (
            <View
              key={a.name}
              style={[
                styles.abilityRow,
                { borderColor: colors.border, backgroundColor: colors.surface },
              ]}
            >
              <Text style={[styles.abilityName, { color: colors.text }]}>
                {capitalize(a.name.replace(/-/g, " "))}
              </Text>
              {a.isHidden ? (
                <Text style={[styles.hidden, { color: colors.textMuted }]}>
                  oculta
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      </Section>
    </ScrollView>
  );
}

function Section({ title, colors, children }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { paddingBottom: 32 },
  hero: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 16,
  },
  image: { width: 200, height: 200 },
  id: { fontSize: 14, fontWeight: "600", marginTop: 8 },
  name: { fontSize: 28, fontWeight: "800", marginTop: 2 },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  col: { gap: 8 },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  typeText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  abilityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  abilityName: { fontSize: 16, fontWeight: "600" },
  hidden: { fontSize: 12, fontStyle: "italic" },
});
