import React, { useContext, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FavoritesContext } from "../context/FavoritesContext";
import { allMaterials } from "../data/materials";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

type Nav = StackNavigationProp<RootStackParamList, "Favorites">;
interface Props {
  navigation: Nav;
}

export default function FavoritesScreen({ navigation }: Props) {
  const { favorites } = useContext(FavoritesContext);
  const favoriteMaterials = useMemo(
    () => allMaterials.filter((m) => favorites.includes(m.id)),
    [favorites]
  );

  return (
    <View style={styles.container}>
      {favoriteMaterials.length === 0 ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Favorites</Text>
          <Text style={styles.subtitle}>
            Your favorite materials will appear here
          </Text>
          <Text style={styles.emptyText}>
            No favorites yet. Tap the star icon on any material to save it!
          </Text>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          <Text style={styles.title}>Favorites</Text>
          {favoriteMaterials.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={styles.item}
              onPress={() =>
                navigation.navigate("MaterialDetail", { material: m })
              }
            >
              <View style={styles.itemLeft}>
                <Text style={styles.itemTitle}>{m.name}</Text>
                {m.symbol && (
                  <Text style={styles.itemSubtitle}>{m.symbol}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#aaa" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1419",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContainer: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 30,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  item: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#2a2a3e",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  itemTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginRight: 8,
  },
  itemSubtitle: {
    fontSize: 16,
    color: "#4a90e2",
    fontWeight: "600",
  },
});
