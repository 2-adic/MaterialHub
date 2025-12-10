import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { allMaterials } from "../data/materials";
import {
  searchMaterials,
  getPropertyDisplayName,
  formatPropertyValue,
} from "../utils/searchUtils";

type ResultsScreenRouteProp = RouteProp<RootStackParamList, "Results">;
type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  route: ResultsScreenRouteProp;
}

export default function ResultsScreen({ route }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const { criteria } = route.params;
  const results = searchMaterials(allMaterials, criteria);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Search Results</Text>
          <Text style={styles.count}>
            {results.length} material{results.length !== 1 ? "s" : ""} found
          </Text>
        </View>

        {results.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No materials match your criteria
            </Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your filters or search terms
            </Text>
          </View>
        ) : (
          results.map((material: any) => (
            <TouchableOpacity
              key={material.id}
              style={styles.card}
              onPress={() => {
                navigation.navigate("MaterialDetail", { material });
              }}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.materialName}>{material.name}</Text>
                  {material.symbol && (
                    <Text style={styles.materialSymbol}>{material.symbol}</Text>
                  )}
                </View>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: getTypeColor(material.type) },
                  ]}
                >
                  <Text style={styles.typeBadgeText}>{material.type}</Text>
                </View>
              </View>

              {material.description && (
                <Text style={styles.description} numberOfLines={2}>
                  {material.description}
                </Text>
              )}

              {criteria.filters.length > 0 && (
                <View style={styles.propertiesContainer}>
                  {criteria.filters.map((filter, index) => {
                    const value = material.properties[filter.property];
                    if (value === undefined) return null;

                    return (
                      <View key={index} style={styles.propertyItem}>
                        <Text style={styles.propertyLabel}>
                          {getPropertyDisplayName(String(filter.property))}
                        </Text>
                        <Text style={styles.propertyValue}>
                          {formatPropertyValue(value, String(filter.property))}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}

              {material.matchScore !== undefined && (
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreLabel}>Match Score:</Text>
                  <View style={styles.scoreBar}>
                    <View
                      style={[
                        styles.scoreBarFill,
                        { width: `${material.matchScore * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.scoreText}>
                    {(material.matchScore * 100).toFixed(0)}%
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function getTypeColor(type: string): string {
  const colors: { [key: string]: string } = {
    element: "#4a90e2",
    compound: "#e74c3c",
    alloy: "#f39c12",
    allotrope: "#2ecc71",
  };
  return colors[type] || "#95a5a6";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1419",
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  count: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 5,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#aaa",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#1a1a2e",
    margin: 15,
    marginTop: 0,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a4e",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  materialName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  materialSymbol: {
    fontSize: 14,
    color: "#4a90e2",
    marginTop: 2,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  description: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 12,
    lineHeight: 20,
  },
  propertiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  propertyItem: {
    backgroundColor: "#16213e",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  propertyLabel: {
    fontSize: 10,
    color: "#aaa",
    marginBottom: 2,
  },
  propertyValue: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2a2a4e",
  },
  scoreLabel: {
    fontSize: 12,
    color: "#aaa",
    marginRight: 10,
  },
  scoreBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#16213e",
    borderRadius: 4,
    overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%",
    backgroundColor: "#4a90e2",
  },
  scoreText: {
    fontSize: 12,
    color: "#4a90e2",
    fontWeight: "bold",
    marginLeft: 10,
    minWidth: 40,
    textAlign: "right",
  },
});
