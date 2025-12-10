/**
 * Defines which properties are affected by temperature and/or pressure.
 * This is used to display indicator dots next to properties in the UI.
 */

export type PropertyDependency = {
  temperature: boolean;
  pressure: boolean;
};

export type DependencyType = "temperature" | "pressure" | "both" | "none";

/**
 * Map of property keys to their temperature/pressure dependencies
 */
export const propertyDependencies: Record<string, PropertyDependency> = {
  // Properties affected by BOTH temperature and pressure
  density: { temperature: true, pressure: true },
  viscosity: { temperature: true, pressure: true },
  surfaceTension: { temperature: true, pressure: true },
  speedOfSound: { temperature: true, pressure: true },
  refractiveIndex: { temperature: true, pressure: true },
  thermalConductivity: { temperature: true, pressure: true },
  electricalConductivity: { temperature: true, pressure: true },
  resistivity: { temperature: true, pressure: true },

  // Properties affected by PRESSURE only (phase transition points)
  meltingPoint: { temperature: false, pressure: true },
  boilingPoint: { temperature: false, pressure: true },
  solidusTemperature: { temperature: false, pressure: true },
  liquidusTemperature: { temperature: false, pressure: true },
  bulkModulus: { temperature: false, pressure: true },
  youngsModulus: { temperature: false, pressure: true },
  shearModulus: { temperature: false, pressure: true },

  // Properties affected by TEMPERATURE only
  specificHeatCapacity: { temperature: true, pressure: false },
  heatOfFusion: { temperature: true, pressure: false },
  heatOfVaporization: { temperature: true, pressure: false },
  thermalExpansionCoefficient: { temperature: true, pressure: false },
};

/**
 * Get the dependency type for a property
 */
export function getPropertyDependencyType(propertyKey: string): DependencyType {
  const dependency = propertyDependencies[propertyKey];

  if (!dependency) {
    return "none";
  }

  if (dependency.temperature && dependency.pressure) {
    return "both";
  } else if (dependency.temperature) {
    return "temperature";
  } else if (dependency.pressure) {
    return "pressure";
  }

  return "none";
}

/**
 * Get the color for a dependency type
 */
export function getDependencyColor(dependencyType: DependencyType): string {
  switch (dependencyType) {
    case "temperature":
      return "#EF5350"; // Red
    case "pressure":
      return "#42A5F5"; // Blue
    case "both":
      return "#AB47BC"; // Purple (blue + red)
    default:
      return "transparent";
  }
}

/**
 * Get a human-readable description of what the dependency means
 */
export function getDependencyDescription(
  dependencyType: DependencyType
): string {
  switch (dependencyType) {
    case "temperature":
      return "Temperature-dependent";
    case "pressure":
      return "Pressure-dependent";
    case "both":
      return "Temperature & Pressure-dependent";
    default:
      return "";
  }
}

/**
 * Get the emoji indicator for a dependency type
 */
export function getDependencyEmoji(dependencyType: DependencyType): string {
  switch (dependencyType) {
    case "temperature":
      return "🟠"; // Orange dot
    case "pressure":
      return "🔵"; // Blue dot
    case "both":
      return "🟣"; // Purple dot
    default:
      return "";
  }
}
