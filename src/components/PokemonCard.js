import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/useTheme';

const formatId = (id) => `#${String(id).padStart(3, '0')}`;
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function PokemonCard({ pokemon, onPress }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Image source={{ uri: pokemon.sprite }} style={styles.image} />
      <View style={styles.info}>
        <Text style={[styles.id, { color: colors.textMuted }]}>
          {formatId(pokemon.id)}
        </Text>
        <Text style={[styles.name, { color: colors.text }]}>
          {capitalize(pokemon.name)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  image: {
    width: 72,
    height: 72,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  id: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
});
