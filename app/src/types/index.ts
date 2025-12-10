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
  // Basic Properties
  density?: number; // g/cm³
  meltingPoint?: number; // °C
  boilingPoint?: number; // °C
  state?: "solid" | "liquid" | "gas";
  color?: string;
  odor?: string;

  // Thermal Properties
  thermalConductivity?: number; // W/(m·K)
  specificHeatCapacity?: number; // J/(g·°C) or kJ/(kg·K)
  heatOfFusion?: number; // kJ/kg
  heatOfVaporization?: number; // kJ/kg
  thermalExpansionCoefficient?: number; // 10⁻⁶/°C
  thermalDiffusivity?: number; // mm²/s
  solidusTemperature?: number; // °C (start of melting range)
  liquidusTemperature?: number; // °C (end of melting range)

  // Electrical Properties
  electricalConductivity?: number; // S/m
  resistivity?: number; // nΩ·m
  temperatureCoefficientResistance?: number; // 10⁻³/°C
  seebeckCoefficient?: number; // μV/K

  // Mechanical Properties
  hardness?: number; // Mohs scale
  bulkModulus?: number; // GPa
  speedOfSound?: number; // m/s
  youngsModulus?: number; // GPa
  shearModulus?: number; // GPa
  poissonsRatio?: number; // dimensionless
  tensileStrength?: number; // MPa
  tensileStrengthRange?: string; // e.g., "200-550 MPa"
  yieldStrength?: number; // MPa
  yieldStrengthRange?: string; // e.g., "100-300 MPa"
  elongation?: number; // %
  elongationRange?: string; // e.g., "25-50%"
  modulusOfResilience?: number; // MPa
  fatigueLimit?: number; // MPa

  // Optical Properties
  refractiveIndex?: number;
  reflectivity?: number; // %
  absorptionCoefficient?: number; // cm⁻¹
  colorCoordinates?: string; // CIE coordinates

  // Fluid Properties
  viscosity?: number; // mPa·s
  surfaceTension?: number; // mN/m

  // Chemical Properties
  pH?: number;
  polarity?: string; // "polar", "nonpolar", "highly polar", "metallic"
  molecularMass?: number; // g/mol
  corrosionResistance?: string; // qualitative description
  reactivity?: string; // reactivity notes
  tarnishBehavior?: string; // tarnish description
  hazards?: string; // hazard information
  nfpaRating?: string; // e.g., "0/1/0"
  flammability?: string; // flammability notes

  // Atomic Properties (for elements)
  electronegativity?: number;
  atomicMass?: number; // u
  ionizationEnergy?: number; // kJ/mol
  electronAffinity?: number; // eV
  atomicRadius?: number; // pm (picometers)
  covalentRadius?: number; // pm
  ionicRadius?: number; // pm
  oxidationStates?: string; // e.g., "−4, −3, −2, −1, 0, +1, +2, +3, +4"
  electronConfiguration?: string; // e.g., "1s2 2s2 2p2"
  atomicVolume?: number; // cm³/mol
  magneticOrdering?: string; // e.g., "diamagnetic", "paramagnetic", "ferromagnetic"
  block?: "s" | "p" | "d" | "f";
  electronShell?: string; // e.g., "2, 8, 18, 32, 18, 6"
  valenceElectrons?: number;

  // Composition (for alloys and compounds)
  composition?: string; // general composition description
  copperContent?: number; // % (for copper alloys)
  zincContent?: number; // % (for zinc alloys)
  tinContent?: number; // % (for tin-containing alloys)
  leadContent?: number; // % (for lead-containing alloys)
  aluminumContent?: number; // % (for aluminum alloys)

  // Identity
  casNumber?: string;
  unsDesignation?: string; // UNS number (e.g., C26000)
  tradeNames?: string; // common trade names
  crystalStructure?: string; // e.g., "FCC", "BCC", "HCP"

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
