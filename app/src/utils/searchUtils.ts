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

  // Sort by name if no filters are applied
  if (criteria.filters.length === 0) {
    results.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // Apply weighted property filters
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

    // Normalize each material to a weighted score based on sort direction and property spread,
    // then rescale so the top material in the current result set is 100%.
    const propertyStats = criteria.filters.map((filter) => {
      const allValues = results
        .map((m: any) => m.properties[filter.property])
        .filter((v: any) => typeof v === "number");

      const minVal = allValues.length > 0 ? Math.min(...allValues) : 0;
      const maxVal = allValues.length > 0 ? Math.max(...allValues) : 0;
      return {
        filter,
        minVal,
        maxVal,
        range: maxVal - minVal || 1,
      };
    });

    const scoredResults = results.map((m: any) => {
      let rankingScore = 0;
      let totalWeight = 0;

      propertyStats.forEach(({ filter, minVal, range }) => {
        const value = m.properties[filter.property];
        if (typeof value === "number") {
          let normalized = (value - minVal) / range;

          if (filter.sortDirection === "asc") {
            normalized = 1 - normalized;
          }

          rankingScore += normalized * filter.weight;
          totalWeight += filter.weight;
        }
      });

      return {
        material: m,
        rankingScore: totalWeight > 0 ? rankingScore / totalWeight : 0,
      };
    });

    scoredResults.sort((a: any, b: any) => b.rankingScore - a.rankingScore);
    const topScore = scoredResults[0]?.rankingScore || 0;

    results = scoredResults.map((item: any) => ({
      ...item.material,
      matchScore: topScore > 0 ? item.rankingScore / topScore : 0,
    }));
  }

  return results;
};

export const getPropertyDisplayName = (property: string): string => {
  const displayNames: { [key: string]: string } = {
    atomicMass: "Atomic Mass (u)",
    boilingPoint: "Boiling Point (°C)",
    bulkModulus: "Bulk Modulus (GPa)",
    density: "Density (g/cm³)",
    electricalConductivity: "Electrical Conductivity (S/m)",
    electronegativity: "Electronegativity",
    hardness: "Hardness (Mohs)",
    heatOfFusion: "Heat of Fusion (kJ/kg)",
    heatOfVaporization: "Heat of Vaporization (kJ/kg)",
    ionizationEnergy: "Ionization Energy (kJ/mol)",
    meltingPoint: "Melting Point (°C)",
    molecularMass: "Molecular Mass (g/mol)",
    pH: "pH",
    refractiveIndex: "Refractive Index",
    specificHeatCapacity: "Specific Heat Capacity (J/(g·°C))",
    speedOfSound: "Speed of Sound (m/s)",
    surfaceTension: "Surface Tension (mN/m)",
    thermalConductivity: "Thermal Conductivity (W/(m·K))",
    thermalExpansionCoefficient: "Thermal Expansion Coefficient (10⁻⁶/°C)",
    valenceElectrons: "Valence Electrons",
    viscosity: "Viscosity (mPa·s)",
  };
  return displayNames[property] || property;
};

export const formatPropertyValue = (value: any, property: string): string => {
  if (typeof value === "number") {
    if (property === "electricalConductivity" && value > 1000) {
      return (value / 1e6).toFixed(2) + " × 10⁶ S/m";
    }
    if (property === "refractiveIndex" || property === "pH") {
      return value.toFixed(3);
    }
    if (property === "viscosity" || property === "surfaceTension") {
      return value.toFixed(2);
    }
    if (property === "specificHeatCapacity") {
      return value.toFixed(3);
    }
    if (property === "thermalExpansionCoefficient") {
      return value.toFixed(1);
    }
    return value.toLocaleString();
  }
  return String(value);
};
