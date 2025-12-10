export interface Material {
  id: string;
  name: string;
  symbol?: string;
  type: "element" | "compound" | "alloy" | "allotrope";
  atomicNumber?: number;
  properties: MaterialProperties;
  category?: string;
  description?: string;
}

export interface MaterialProperties {
  density?: number; // g/cm³
  meltingPoint?: number; // °C
  boilingPoint?: number; // °C
  thermalConductivity?: number; // W/(m·K)
  electricalConductivity?: number; // S/m
  hardness?: number; // Mohs scale
  electronegativity?: number;
  atomicMass?: number;
  state?: "solid" | "liquid" | "gas";
  color?: string;
  ionizationEnergy?: number; // kJ/mol
  block?: "s" | "p" | "d" | "f";
  electronShell?: string; // e.g., "2, 8, 18, 32, 18, 6"
  valenceElectrons?: number;
  [key: string]: any; // Allow additional properties
}

export interface SearchFilter {
  property: keyof MaterialProperties;
  min?: number;
  max?: number;
  weight: number; // 0-1 for priority
  sortDirection?: "asc" | "desc"; // low to high or high to low
}

export interface SearchCriteria {
  filters: SearchFilter[];
  materialType?: Material["type"];
  searchText?: string;
}

export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  Results: { criteria: SearchCriteria };
  MaterialDetail: { material: Material };
  Favorites: undefined;
};
