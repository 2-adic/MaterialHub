import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { periodicTableData } from "../data/materials";
import { Material, RootStackParamList } from "../types";

const { width } = Dimensions.get("window");
const CELL_SIZE = Math.floor((width - 40) / 18); // 18 columns in periodic table

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedElement, setSelectedElement] = useState<Material | null>(
    periodicTableData.find((el) => el.atomicNumber === 6) || null
  );

  // Complete periodic table layout (7 periods + lanthanides + actinides)
  const layoutRows = [
    // Period 1
    [
      1,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      2,
    ],
    // Period 2
    [
      3,
      4,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      5,
      6,
      7,
      8,
      9,
      10,
    ],
    // Period 3
    [
      11,
      12,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      13,
      14,
      15,
      16,
      17,
      18,
    ],
    // Period 4
    [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    // Period 5
    [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
    // Period 6 (with lanthanide placeholder)
    [
      55,
      56,
      "La-Lu",
      72,
      73,
      74,
      75,
      76,
      77,
      78,
      79,
      80,
      81,
      82,
      83,
      84,
      85,
      86,
    ],
    // Period 7 (with actinide placeholder)
    [
      87,
      88,
      "Ac-Lr",
      104,
      105,
      106,
      107,
      108,
      109,
      110,
      111,
      112,
      113,
      114,
      115,
      116,
      117,
      118,
    ],
  ];

  // Lanthanides (elements 57-71)
  const lanthanides = [
    57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
  ];

  // Actinides (elements 89-103)
  const actinides = [
    89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103,
  ];

  const getElementByAtomicNumber = (num: number | null) => {
    if (!num) return null;
    return periodicTableData.find((el) => el.atomicNumber === num);
  };

  const getCategoryColor = (category?: string) => {
    const colors: { [key: string]: string } = {
      nonmetal: "#4a90e2",
      "noble-gas": "#9b59b6",
      "alkali-metal": "#e74c3c",
      "alkaline-earth-metal": "#e67e22",
      "transition-metal": "#f39c12",
      "post-transition-metal": "#95a5a6",
      metalloid: "#16a085",
      halogen: "#27ae60",
      lanthanide: "#8e44ad",
      actinide: "#c0392b",
    };
    return colors[category || ""] || "#34495e";
  };

  const renderCell = (atomicNum: number | string | null, colIndex: number) => {
    if (!atomicNum) {
      return <View key={colIndex} style={[styles.cell, styles.emptyCell]} />;
    }

    // Handle lanthanide/actinide placeholders
    if (typeof atomicNum === "string") {
      return (
        <View key={colIndex} style={[styles.cell, styles.placeholderCell]}>
          <Text style={styles.placeholderText}>{atomicNum}</Text>
        </View>
      );
    }

    const element = getElementByAtomicNumber(atomicNum);
    if (!element) {
      return <View key={colIndex} style={[styles.cell, styles.emptyCell]} />;
    }

    return (
      <TouchableOpacity
        key={colIndex}
        style={[
          styles.cell,
          styles.elementCell,
          { backgroundColor: getCategoryColor(element.category) },
          selectedElement?.id === element.id && styles.selectedCell,
        ]}
        onPress={() => setSelectedElement(element)}
      >
        <View style={styles.symbolContainer}>
          <Text
            style={styles.symbol}
            allowFontScaling={false}
            adjustsFontSizeToFit={false}
            maxFontSizeMultiplier={1}
          >
            {element.symbol}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.tableContainer}>
          {layoutRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((atomicNum, colIndex) =>
                renderCell(atomicNum, colIndex)
              )}
            </View>
          ))}

          {/* Lanthanides row */}
          <View style={[styles.row, styles.separateRow]}>
            {lanthanides.map((atomicNum, colIndex) =>
              renderCell(atomicNum, colIndex)
            )}
          </View>

          {/* Actinides row */}
          <View style={[styles.row, styles.separateRow]}>
            {actinides.map((atomicNum, colIndex) =>
              renderCell(atomicNum, colIndex)
            )}
          </View>
        </View>

        {/* Element details */}
        {selectedElement && (
          <View style={styles.detailsContainer}>
            <View style={styles.headerRow}>
              <View style={styles.headerContent}>
                <Text style={styles.detailsTitle}>{selectedElement.name}</Text>
                <Text style={styles.detailsSymbol}>
                  {selectedElement.symbol}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  navigation.navigate("MaterialDetail", {
                    material: selectedElement,
                  })
                }
              >
                <Ionicons
                  name="arrow-forward-circle"
                  size={40}
                  color="#4a90e2"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.description}>
              {selectedElement.description}
            </Text>

            <View style={styles.propertiesGrid}>
              <View style={styles.propertyCard}>
                <Text style={styles.propertyLabel}>Atomic Number</Text>
                <Text style={styles.propertyValue}>
                  {selectedElement.atomicNumber}
                </Text>
              </View>
              <View style={styles.propertyCard}>
                <Text style={styles.propertyLabel}>Atomic Mass</Text>
                <Text style={styles.propertyValue}>
                  {selectedElement.properties.atomicMass?.toFixed(3)} u
                </Text>
              </View>
              {selectedElement.properties.ionizationEnergy && (
                <View style={styles.propertyCard}>
                  <Text style={styles.propertyLabel}>Ionization Energy</Text>
                  <Text style={styles.propertyValue}>
                    {selectedElement.properties.ionizationEnergy} kJ/mol
                  </Text>
                </View>
              )}
              {selectedElement.properties.block && (
                <View style={styles.propertyCard}>
                  <Text style={styles.propertyLabel}>Block</Text>
                  <Text style={styles.propertyValue}>
                    {selectedElement.properties.block}
                  </Text>
                </View>
              )}
              {selectedElement.properties.electronShell && (
                <View style={styles.propertyCard}>
                  <Text style={styles.propertyLabel}>Electron Shell</Text>
                  <Text style={styles.propertyValue}>
                    {selectedElement.properties.electronShell}
                  </Text>
                </View>
              )}
              {selectedElement.properties.valenceElectrons !== undefined && (
                <View style={styles.propertyCard}>
                  <Text style={styles.propertyLabel}>Valence Electrons</Text>
                  <Text style={styles.propertyValue}>
                    {selectedElement.properties.valenceElectrons}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
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
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 20,
  },
  tableContainer: {
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: 1,
  },
  emptyCell: {
    backgroundColor: "transparent",
  },
  elementCell: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "transparent",
    padding: 0,
  },
  selectedCell: {
    borderColor: "#fff",
  },
  symbolContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  atomicNumber: {
    fontSize: 8,
    color: "#fff",
    opacity: 0.7,
  },
  symbol: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#fff",
    includeFontPadding: false,
    height: 14,
  },
  placeholderCell: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
    borderRadius: 4,
    opacity: 0.6,
  },
  placeholderText: {
    fontSize: 7,
    color: "#fff",
    fontWeight: "bold",
  },
  separateRow: {
    marginTop: 10,
  },
  detailsContainer: {
    backgroundColor: "#1a1a2e",
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    position: "relative",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  iconButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 5,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  detailsSymbol: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#4a90e2",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20,
  },
  propertiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  propertyCard: {
    width: "48%",
    backgroundColor: "#16213e",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  propertyLabel: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 5,
  },
  propertyValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
