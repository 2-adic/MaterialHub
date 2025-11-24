import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";

type MaterialDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "MaterialDetail"
>;

interface Props {
  route: MaterialDetailScreenRouteProp;
}

export default function MaterialDetailScreen({ route }: Props) {
  const { material } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.name}>{material.name}</Text>
          {material.symbol && (
            <Text style={styles.symbol}>{material.symbol}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.wipContainer}>
            <Text style={styles.wipText}>🚧 Work in Progress 🚧</Text>
            <Text style={styles.wipSubtext}>
              Detailed information coming soon
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Properties</Text>
          <View style={styles.wipContainer}>
            <Text style={styles.wipText}>🚧 Work in Progress 🚧</Text>
            <Text style={styles.wipSubtext}>
              Physical and chemical properties will be displayed here
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Applications</Text>
          <View style={styles.wipContainer}>
            <Text style={styles.wipText}>🚧 Work in Progress 🚧</Text>
            <Text style={styles.wipSubtext}>
              Common uses and applications will be listed here
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1419",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a3e",
    marginBottom: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  symbol: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4a90e2",
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  wipContainer: {
    backgroundColor: "#1a1a2e",
    padding: 30,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2a2a3e",
    borderStyle: "dashed",
  },
  wipText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f39c12",
    marginBottom: 10,
  },
  wipSubtext: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
  },
});
