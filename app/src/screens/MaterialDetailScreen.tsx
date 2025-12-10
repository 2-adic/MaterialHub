import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList, Material } from "../types";
import {
  getPropertyDependencyType,
  getDependencyColor,
  getDependencyDescription,
} from "../utils/propertyDependencies";
import PhaseChangeChart from "../components/PhaseChangeChart";

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
        "electronAffinity",
        "atomicRadius",
        "covalentRadius",
        "ionicRadius",
        "oxidationStates",
        "electronConfiguration",
        "atomicVolume",
        "magneticOrdering",
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
      properties: [
        "state",
        "color",
        "odor",
        "density",
        "meltingPoint",
        "boilingPoint",
        "refractiveIndex",
        "reflectivity",
        "viscosity",
        "surfaceTension",
      ],
    });
  }

  // Mechanical Properties (for compound/allotrope/alloy)
  if (type === "compound" || type === "allotrope" || type === "alloy") {
    categories.push({
      title: "Mechanical Properties",
      properties: [
        "hardness",
        "bulkModulus",
        "speedOfSound",
        "youngsModulus",
        "shearModulus",
        "poissonsRatio",
        "tensileStrength",
        "tensileStrengthRange",
        "yieldStrength",
        "yieldStrengthRange",
        "elongation",
        "elongationRange",
        "modulusOfResilience",
        "fatigueLimit",
      ],
    });
  }

  // Thermal Properties (for compound/allotrope/alloy)
  if (type === "compound" || type === "allotrope" || type === "alloy") {
    categories.push({
      title: "Thermal Properties",
      properties: [
        "thermalConductivity",
        "specificHeatCapacity",
        "heatOfFusion",
        "heatOfVaporization",
        "thermalExpansionCoefficient",
        "thermalDiffusivity",
        "solidusTemperature",
        "liquidusTemperature",
      ],
    });
  }

  // Chemical Properties (for compound/allotrope)
  if (type === "compound" || type === "allotrope" || type === "alloy") {
    categories.push({
      title: "Chemical Properties",
      properties: [
        "pH",
        "polarity",
        "molecularMass",
        "composition",
        "copperContent",
        "zincContent",
        "tinContent",
        "leadContent",
        "aluminumContent",
        "casNumber",
        "unsDesignation",
        "tradeNames",
        "crystalStructure",
      ],
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
    properties: [
      "hazards",
      "nfpaRating",
      "flammability",
      "corrosionResistance",
      "reactivity",
      "tarnishBehavior",
    ],
  });

  // Charts (for all)
  categories.push({
    title: "Charts",
    properties: [],
  });

  return categories;
}

function formatPropertyName(key: string): string {
  // Special case for pH
  if (key === "pH") return "pH";

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function formatPropertyValue(key: string, value: any): string {
  if (value === undefined || value === null) return "N/A";

  switch (key) {
    // Basic Properties
    case "density":
      return `${value} g/cm³`;
    case "meltingPoint":
    case "boilingPoint":
      return `${value} °C (at 1 atm)`;

    // Thermal Properties
    case "thermalConductivity":
      return `${value} W/(m·K)`;
    case "specificHeatCapacity":
      return `${value} J/(g·°C)`;
    case "heatOfFusion":
      return `${value} kJ/kg`;
    case "heatOfVaporization":
      return `${value} kJ/kg`;
    case "thermalExpansionCoefficient":
      return `${value} × 10⁻⁶/°C`;
    case "thermalDiffusivity":
      return `${value} mm²/s`;
    case "solidusTemperature":
    case "liquidusTemperature":
      return `${value} °C`;

    // Electrical Properties
    case "electricalConductivity":
      return `${value} S/m`;
    case "resistivity":
      return `${value} nΩ·m`;
    case "temperatureCoefficientResistance":
      return `${value} × 10⁻³/°C`;
    case "seebeckCoefficient":
      return `${value} μV/K`;

    // Mechanical Properties
    case "hardness":
      return `${value} (Mohs)`;
    case "bulkModulus":
      return `${value} GPa`;
    case "speedOfSound":
      return `${value} m/s`;
    case "youngsModulus":
      return `${value} GPa`;
    case "shearModulus":
      return `${value} GPa`;
    case "poissonsRatio":
      return `${value}`;
    case "tensileStrength":
      return `${value} MPa`;
    case "yieldStrength":
      return `${value} MPa`;
    case "elongation":
      return `${value}%`;
    case "modulusOfResilience":
      return `${value} MPa`;
    case "fatigueLimit":
      return `${value} MPa`;
    case "tensileStrengthRange":
    case "yieldStrengthRange":
    case "elongationRange":
      return String(value);

    // Optical Properties
    case "refractiveIndex":
      return `${value}`;
    case "reflectivity":
      return `${value}%`;
    case "absorptionCoefficient":
      return `${value} cm⁻¹`;

    // Fluid Properties
    case "viscosity":
      return `${value} mPa·s`;
    case "surfaceTension":
      return `${value} mN/m`;

    // Chemical Properties
    case "molecularMass":
      return `${value} g/mol`;
    case "copperContent":
    case "zincContent":
    case "tinContent":
    case "leadContent":
    case "aluminumContent":
      return `${value}%`;

    // Atomic Properties
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
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const renderProperty = (key: string, isLast: boolean) => {
    let value: any;

    if (key === "type" || key === "category" || key === "description") {
      value = material[key as keyof Material];
    } else {
      value = material.properties[key];
    }

    if (value === undefined || value === null) return null;

    const dependencyType = getPropertyDependencyType(key);
    const showIndicator = dependencyType !== "none";
    const indicatorColor = getDependencyColor(dependencyType);

    return (
      <View
        key={key}
        style={[styles.propertyRow, isLast && styles.propertyRowLast]}
      >
        <View style={styles.propertyLabelContainer}>
          {showIndicator && (
            <View
              style={[
                styles.dependencyIndicator,
                { backgroundColor: indicatorColor },
              ]}
            />
          )}
          <Text style={styles.propertyLabel}>{formatPropertyName(key)}:</Text>
        </View>
        <Text style={styles.propertyValue}>
          {formatPropertyValue(key, value)}
        </Text>
      </View>
    );
  };

  const renderCategory = (category: PropertyCategory) => {
    if (category.title === "Charts") {
      // Only show Charts section if the material has a phase chart
      if (material.properties.hasPhaseChart) {
        return (
          <View key={category.title} style={styles.section}>
            <Text style={styles.sectionTitle}>Phase Diagram</Text>
            <View style={styles.chartContainer}>
              <PhaseChangeChart />
            </View>
          </View>
        );
      }
      // Don't render Charts section if there are no charts to show
      return null;
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
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.name}>{material.name}</Text>
              {material.symbol && (
                <Text style={styles.symbol}>{material.symbol}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => setInfoModalVisible(true)}
            >
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>i</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {categories.map((category) => renderCategory(category))}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setInfoModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Property Indicators</Text>
            <Text style={styles.modalDescription}>
              All listed values are based on standard temperature and pressure
              (STP: 0°C, 1 atm). Some properties vary with temperature and/or
              pressure. Color indicators show which conditions affect each
              property:
            </Text>

            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#EF5350" }]}
              />
              <Text style={styles.legendText}>Temperature-dependent</Text>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#42A5F5" }]}
              />
              <Text style={styles.legendText}>Pressure-dependent</Text>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#AB47BC" }]}
              />
              <Text style={styles.legendText}>Both temperature & pressure</Text>
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setInfoModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a3e",
    marginBottom: 20,
    position: "relative",
  },
  headerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextContainer: {
    alignItems: "center",
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
  infoButton: {
    position: "absolute",
    top: 0,
    right: 8,
    padding: 4,
  },
  infoIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4a90e2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#5fa3f5",
  },
  infoIcon: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
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
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a3e",
  },
  propertyRowLast: {
    borderBottomWidth: 0,
  },
  propertyLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dependencyIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#2a2a3e",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 20,
    lineHeight: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendText: {
    fontSize: 16,
    color: "#fff",
  },
  modalCloseButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  chartContainer: {
    marginTop: 10,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#2a2a3e",
    alignItems: "center",
  },
  chartDescription: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 10,
    lineHeight: 20,
    fontStyle: "italic",
  },
});
