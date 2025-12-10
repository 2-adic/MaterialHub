import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import PlatformPicker from "../components/PlatformPicker";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SearchFilter, MaterialProperties, RootStackParamList } from "../types";

type SearchScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Search"
>;

export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchText, setSearchText] = useState("");
  const [materialType, setMaterialType] = useState<string>("all");
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [weightTexts, setWeightTexts] = useState<{ [key: number]: string }>({});

  const availableProperties: (keyof MaterialProperties)[] = [
    "boilingPoint",
    "density",
    "electricalConductivity",
    "hardness",
    "meltingPoint",
    "thermalConductivity",
  ];

  const addFilter = () => {
    const newIndex = filters.length;
    setFilters([
      ...filters,
      {
        property: "density",
        min: undefined,
        max: undefined,
        weight: 1,
        sortDirection: "asc",
      },
    ]);
    setWeightTexts({ ...weightTexts, [newIndex]: "1" });
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
    const newWeightTexts = { ...weightTexts };
    delete newWeightTexts[index];
    // Reindex remaining weights
    const reindexed: { [key: number]: string } = {};
    Object.keys(newWeightTexts).forEach((key) => {
      const oldIndex = parseInt(key);
      if (oldIndex > index) {
        reindexed[oldIndex - 1] = newWeightTexts[oldIndex];
      } else {
        reindexed[oldIndex] = newWeightTexts[oldIndex];
      }
    });
    setWeightTexts(reindexed);
  };

  const updateFilter = (index: number, updates: Partial<SearchFilter>) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    navigation.navigate("Results", {
      criteria: {
        searchText: searchText.trim(),
        materialType:
          materialType === "all" ? undefined : (materialType as any),
        filters,
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Text */}
        <View style={styles.section}>
          <Text style={styles.label}>Search by Name or Symbol</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Carbon, Fe, Water..."
            placeholderTextColor="#666"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Material Type */}
        <View style={styles.section}>
          <Text style={styles.label}>Material Type</Text>
          <View style={styles.pickerContainer}>
            <PlatformPicker
              selectedValue={materialType}
              onValueChange={(value) => setMaterialType(value)}
            >
              <PlatformPicker.Item label="All Types" value="all" />
              <PlatformPicker.Item label="Elements" value="element" />
              <PlatformPicker.Item label="Compounds" value="compound" />
              <PlatformPicker.Item label="Alloys" value="alloy" />
              <PlatformPicker.Item label="Allotropes" value="allotrope" />
            </PlatformPicker>
          </View>
        </View>

        {/* Property Filters */}
        <View style={styles.section}>
          <Text style={styles.label}>Property Filters</Text>
          <Text style={styles.subtitle}>
            Add filters and set weights to prioritize properties
          </Text>

          {filters.map((filter, index) => (
            <View key={index} style={styles.filterCard}>
              <View style={styles.filterHeader}>
                <Text style={styles.filterTitle}>Filter {index + 1}</Text>
                <TouchableOpacity
                  onPress={() => removeFilter(index)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.pickerContainer}>
                <PlatformPicker
                  selectedValue={filter.property}
                  onValueChange={(value: keyof MaterialProperties) =>
                    updateFilter(index, { property: value })
                  }
                >
                  {availableProperties.map((prop) => (
                    <PlatformPicker.Item
                      key={prop}
                      label={String(prop)
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                      value={prop}
                    />
                  ))}
                </PlatformPicker>
              </View>

              <View style={styles.rangeSection}>
                <Text style={styles.sectionLabel}>Range</Text>
                <View style={styles.rangeContainer}>
                  <TextInput
                    style={[styles.input, styles.rangeInputField]}
                    placeholder="Min"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={filter.min?.toString() || ""}
                    onChangeText={(text) =>
                      updateFilter(index, {
                        min: text ? parseFloat(text) : undefined,
                      })
                    }
                  />
                  <Text style={styles.rangeSeparator}>—</Text>
                  <TextInput
                    style={[styles.input, styles.rangeInputField]}
                    placeholder="Max"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={filter.max?.toString() || ""}
                    onChangeText={(text) =>
                      updateFilter(index, {
                        max: text ? parseFloat(text) : undefined,
                      })
                    }
                  />
                </View>
              </View>

              <View style={styles.sortSection}>
                <Text style={styles.sectionLabel}>Sort Order</Text>
                <TouchableOpacity
                  style={styles.sortButton}
                  onPress={() =>
                    updateFilter(index, {
                      sortDirection:
                        filter.sortDirection === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  <Text style={styles.sortButtonText}>
                    {filter.sortDirection === "asc"
                      ? "↑ Low to High"
                      : "↓ High to Low"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.weightContainer}>
                <Text style={styles.sectionLabel}>Weight</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1"
                  placeholderTextColor="#666"
                  keyboardType="number-pad"
                  value={
                    weightTexts[index] !== undefined
                      ? weightTexts[index]
                      : filter.weight.toString()
                  }
                  onChangeText={(text) => {
                    setWeightTexts({ ...weightTexts, [index]: text });
                  }}
                  onBlur={() => {
                    const text = weightTexts[index];
                    const value = text ? parseInt(text, 10) : 1;
                    const finalValue = !isNaN(value) && value > 0 ? value : 1;
                    updateFilter(index, { weight: finalValue });
                    setWeightTexts({
                      ...weightTexts,
                      [index]: finalValue.toString(),
                    });
                  }}
                />
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addFilter}>
            <Text style={styles.addButtonText}>+ Add Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Search Button */}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search Materials</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1419",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    padding: 20,
    paddingBottom: 10,
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#1a1a2e",
    borderWidth: 1,
    borderColor: "#2a2a4e",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "#1a1a2e",
    borderWidth: 1,
    borderColor: "#2a2a4e",
    borderRadius: 8,
  },
  filterCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#2a2a4e",
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a90e2",
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: -3,
  },
  rangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  rangeInputField: {
    flex: 1,
  },
  rangeSeparator: {
    color: "#666",
    fontSize: 16,
    marginHorizontal: 8,
  },
  rangeSection: {
    marginTop: 10,
  },
  sortSection: {
    marginTop: 10,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 5,
  },
  sortButton: {
    backgroundColor: "#2a2a4e",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4a90e2",
    alignItems: "center",
  },
  sortButtonText: {
    color: "#4a90e2",
    fontSize: 14,
    fontWeight: "600",
  },
  weightContainer: {
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#2a2a4e",
    borderWidth: 2,
    borderColor: "#4a90e2",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  addButtonText: {
    color: "#4a90e2",
    fontSize: 16,
    fontWeight: "600",
  },
  searchButton: {
    backgroundColor: "#4a90e2",
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
