import { Material, SearchCriteria } from "../types";

export const searchMaterials = (
  materials: Material[],
  criteria: SearchCriteria
): Material[] => {
  let results = [...materials];

  // Filter by material type
  if (criteria.materialType) {
    results = results.filter((m) => m.type === criteria.materialType);
  }

  // Filter by search text
  if (criteria.searchText && criteria.searchText.trim() !== "") {
    const searchLower = criteria.searchText.toLowerCase();
    results = results.filter(
      (m) =>
        m.name.toLowerCase().includes(searchLower) ||
        m.symbol?.toLowerCase().includes(searchLower) ||
        m.description?.toLowerCase().includes(searchLower)
    );
  }

  // Apply weighted property filters
  if (criteria.filters.length > 0) {
    results = results.map((material) => {
      let score = 0;
      let totalWeight = 0;
      let hasAllProperties = true;

      criteria.filters.forEach((filter) => {
        const value = material.properties[filter.property];

        // Check if material has this property
        if (value === undefined || value === null) {
          hasAllProperties = false;
          return;
        }

        if (typeof value === "number") {
          let matches = true;

          if (filter.min !== undefined && value < filter.min) {
            matches = false;
          }
          if (filter.max !== undefined && value > filter.max) {
            matches = false;
          }

          if (matches) {
            score += filter.weight;
          }
          totalWeight += filter.weight;
        }
      });

      return {
        ...material,
        matchScore:
          totalWeight > 0 && hasAllProperties ? score / totalWeight : 0,
        hasAllProperties,
      };
    });

    // Filter out materials that don't have all properties or have 0 score
    results = results.filter(
      (m: any) => m.hasAllProperties && m.matchScore > 0
    );

    // Sort by weighted combination of all filters
    results.sort((a: any, b: any) => {
      let scoreA = 0;
      let scoreB = 0;
      let totalWeight = 0;

      criteria.filters.forEach((filter) => {
        const valueA = a.properties[filter.property];
        const valueB = b.properties[filter.property];

        if (typeof valueA === "number" && typeof valueB === "number") {
          // Normalize values to 0-1 scale based on min/max in results
          const allValues = results
            .map((m: any) => m.properties[filter.property])
            .filter((v: any) => typeof v === "number");
          const minVal = Math.min(...allValues);
          const maxVal = Math.max(...allValues);
          const range = maxVal - minVal || 1; // Avoid division by zero

          let normalizedA = (valueA - minVal) / range;
          let normalizedB = (valueB - minVal) / range;

          // For ascending (low to high), lower values should score higher
          // For descending (high to low), higher values should score higher
          if (filter.sortDirection === "asc") {
            normalizedA = 1 - normalizedA;
            normalizedB = 1 - normalizedB;
          }

          scoreA += normalizedA * filter.weight;
          scoreB += normalizedB * filter.weight;
          totalWeight += filter.weight;
        }
      });

      // Higher score should come first
      return totalWeight > 0 ? scoreB / totalWeight - scoreA / totalWeight : 0;
    });
  }

  return results;
};

export const getPropertyDisplayName = (property: string): string => {
  const displayNames: { [key: string]: string } = {
    density: "Density (g/cm³)",
    meltingPoint: "Melting Point (°C)",
    boilingPoint: "Boiling Point (°C)",
    thermalConductivity: "Thermal Conductivity (W/(m·K))",
    electricalConductivity: "Electrical Conductivity (S/m)",
    hardness: "Hardness (Mohs)",
    electronegativity: "Electronegativity",
    atomicMass: "Atomic Mass",
  };
  return displayNames[property] || property;
};

export const formatPropertyValue = (value: any, property: string): string => {
  if (typeof value === "number") {
    if (property === "electricalConductivity" && value > 1000) {
      return (value / 1e6).toFixed(2) + " × 10⁶ S/m";
    }
    return value.toLocaleString();
  }
  return String(value);
};
