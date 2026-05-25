import { StatusBar } from "expo-status-bar";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./src/screens/HomeScreen";
import DetailsScreen from "./src/screens/DetailsScreen";
import ThemeToggleButton from "./src/components/ThemeToggleButton";
import { ThemeProvider, useTheme } from "./src/theme/useTheme";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { isDark, colors } = useTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme : DefaultTheme).colors,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          screenOptions={{
            headerTitleAlign: "left",
            headerTitleStyle: { fontWeight: "800" },
            headerRight: () => <ThemeToggleButton />,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Pokédex" }}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{ headerBackButtonDisplayMode: "minimal" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
