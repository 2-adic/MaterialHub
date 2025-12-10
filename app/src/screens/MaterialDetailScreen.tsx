import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList, Material } from "../types";

type MaterialDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "MaterialDetail"
>;

interface Props {
  route: MaterialDetailScreenRouteProp;
}

interface PropertyCategory {
  title: string;
  properties: string[];
}

function getCategories(material: Material): PropertyCategory[] {
  const categories: PropertyCategory[] = [];
  const type = material.type;

  // Atomic Properties (for element/compound/allotrope)
  if (type === "element" || type === "compound" || type === "allotrope") {
    categories.push({
      title: "Atomic Properties",
      properties: [
        "atomicNumber",
        "atomicMass",
        "electronegativity",
        "ionizationEnergy",
        "block",
        "electronShell",
        "valenceElectrons",
      ],
    });
  }

  // Physical Properties (for compound/allotrope/alloy)
  if (type === "compound" || type === "allotrope" || type === "alloy") {
    categories.push({
      title: "Physical Properties",
      properties: ["state", "color", "density", "meltingPoint", "boilingPoint"],
    });
  }

  // Mechanical Properties (for compound/allotrope/alloy)
  if (type === "compound" || type === "allotrope" || type === "alloy") {
    categories.push({
      title: "Mechanical Properties",
      properties: [
        "hardness",
        "tensileStrength",
        "yieldStrength",
        "elasticModulus",
      ],
    });
  }

  // Thermal Properties (for compound/allotrope/alloy)
  if (type === "compound" || type === "allotrope" || type === "alloy") {
    categories.push({
      title: "Thermal Properties",
      properties: ["thermalConductivity", "thermalExpansion", "specificHeat"],
    });
  }

  // Identity & Classification (for all)
  categories.push({
    title: "Identity & Classification",
    properties: ["type", "category", "description"],
  });

  // Safety (for all)
  categories.push({
    title: "Safety",
    properties: ["toxicity", "hazards", "handling", "storage"],
  });

  // Charts (for all)
  categories.push({
    title: "Charts",
    properties: [],
  });

  return categories;
}

function formatPropertyName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function formatPropertyValue(key: string, value: any): string {
  if (value === undefined || value === null) return "N/A";

  switch (key) {
    case "density":
      return `${value} g/cm³`;
    case "meltingPoint":
    case "boilingPoint":
      return `${value}°C`;
    case "thermalConductivity":
      return `${value} W/(m·K)`;
    case "electricalConductivity":
      return `${value} S/m`;
    case "hardness":
      return `${value} (Mohs)`;
    case "ionizationEnergy":
      return `${value} kJ/mol`;
    case "atomicMass":
      return `${value} u`;
    case "block":
      // Don't capitalize block values (s, p, d, f)
      return String(value);
    default:
      const stringValue = String(value);
      // Don't capitalize if it starts with a number
      if (/^\d/.test(stringValue)) {
        return stringValue;
      }
      // Capitalize first letter
      return stringValue.charAt(0).toUpperCase() + stringValue.slice(1);
  }
}

export default function MaterialDetailScreen({ route }: Props) {
  const { material } = route.params;
  const categories = getCategories(material);

  const renderProperty = (key: string, isLast: boolean) => {
    let value: any;

    if (key === "type" || key === "category" || key === "description") {
      value = material[key as keyof Material];
    } else {
      value = material.properties[key];
    }

    if (value === undefined || value === null) return null;

    return (
      <View
        key={key}
        style={[styles.propertyRow, isLast && styles.propertyRowLast]}
      >
        <Text style={styles.propertyLabel}>{formatPropertyName(key)}:</Text>
        <Text style={styles.propertyValue}>
          {formatPropertyValue(key, value)}
        </Text>
      </View>
    );
  };

  const renderCategory = (category: PropertyCategory) => {
    if (category.title === "Charts") {
      return (
        <View key={category.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{category.title}</Text>
          <View style={styles.wipContainer}>
            <Text style={styles.wipText}>🚧 Work in Progress 🚧</Text>
            <Text style={styles.wipSubtext}>
              Visual charts and graphs coming soon
            </Text>
          </View>
        </View>
      );
    }

    if (category.title === "Safety") {
      return (
        <View key={category.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{category.title}</Text>
          <View style={styles.wipContainer}>
            <Text style={styles.wipText}>🚧 Work in Progress 🚧</Text>
            <Text style={styles.wipSubtext}>
              Safety information coming soon
            </Text>
          </View>
        </View>
      );
    }

    const propertiesWithValues = category.properties.filter((prop) => {
      let value: any;
      if (prop === "type" || prop === "category" || prop === "description") {
        value = material[prop as keyof Material];
      } else {
        value = material.properties[prop];
      }
      return value !== undefined && value !== null;
    });

    if (propertiesWithValues.length === 0) return null;

    return (
      <View key={category.title} style={styles.section}>
        <Text style={styles.sectionTitle}>{category.title}</Text>
        <View style={styles.propertiesContainer}>
          {propertiesWithValues.map((prop, index) =>
            renderProperty(prop, index === propertiesWithValues.length - 1)
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.name}>{material.name}</Text>
          {material.symbol && (
            <Text style={styles.symbol}>{material.symbol}</Text>
          )}
        </View>

        {categories.map((category) => renderCategory(category))}
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
  propertiesContainer: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#2a2a3e",
  },
  propertyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a3e",
  },
  propertyRowLast: {
    borderBottomWidth: 0,
  },
  propertyLabel: {
    fontSize: 14,
    color: "#aaa",
    flex: 1,
  },
  propertyValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
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
