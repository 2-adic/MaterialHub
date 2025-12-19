export const WaterPhaseChangeChart = {
  xAxisMin: -273.15,
  xAxisMax: 1900,
  yAxisMin: 0,
  yAxisMax: 1900,
  xAxisTicks: [100],
  yAxisTicks: [1],
  xScale: (value: number): number => {
    /*
    Sections:
    [-273.15 to 0]: Linear (20% of axis)
    (0 to 1900]: Logarithmic (80% of axis)
    */
    const min = -273.15;
    const max = 1900;
    const segmentTransition = 0;
    const segmentFraction = 0.2;

    if (value <= segmentTransition) {
      const normalized = (value - min) / (segmentTransition - min);
      return normalized * segmentFraction;
    } else {
      const logValue = Math.log10(value - segmentTransition + 1);
      const logMax = Math.log10(max - segmentTransition + 1);
      const normalized = logValue / logMax;
      return segmentFraction + normalized * (1 - segmentFraction);
    }
  },
  yScale: (value: number): number => {
    /*
    Sections:
    [0 to 0.00604]: Linear (20% of axis)
    (0.00604 to 1900]: Logarithmic (80% of axis)
    */
    const min = 0;
    const max = 1900;
    const segmentTransition = 0.00604;
    const segmentFraction = 0.2;

    if (value <= segmentTransition) {
      const normalized = (value - min) / (segmentTransition - min);
      return normalized * segmentFraction;
    } else {
      const logValue = Math.log10(value);
      const logMin = Math.log10(segmentTransition);
      const logMax = Math.log10(max);
      const normalized = (logValue - logMin) / (logMax - logMin);
      return segmentFraction + normalized * (1 - segmentFraction);
    }
  },
  xAxisLabel: "Temperature (°C)",
  yAxisLabel: "Pressure (atm)",
  markers: [
    {
      x: 0.01,
      y: 0.00604,
      radius: 5,
      color: "#37ff37ff",
      strokeColor: "#fff",
      strokeWidth: 2,
      label: "Triple Point",
      labelOffsetX: 10,
      labelOffsetY: 20,
      labelFontSize: 11,
      labelColor: "#37ff37ff",
      labelFontWeight: "bold" as const,
      labelTextAnchor: "start" as const,
      tickMarkColor: "#37ff37ff",
    },
    {
      x: 374.15,
      y: 218.3,
      radius: 6,
      color: "#FF4444",
      strokeColor: "#fff",
      strokeWidth: 2,
      label: "Critical Point",
      labelOffsetX: -10,
      labelOffsetY: -15,
      labelFontSize: 11,
      labelColor: "#FF4444",
      labelFontWeight: "bold" as const,
      labelTextAnchor: "end" as const,
      tickMarkColor: "#FF4444",
    },
  ],
  boundaries: [
    {
      id: "gas-solid",
      points: [
        { x: -100, y: 0.0000000138 },
        { x: -90, y: 0.0000000949 },
        { x: -80, y: 0.000000537 },
        { x: -70, y: 0.00000257 },
        { x: -60, y: 0.0000106 },
        { x: -50, y: 0.0000387 },
        { x: -40, y: 0.000126 },
        { x: -30, y: 0.000374 },
        { x: -20, y: 0.00102 },
        { x: -10, y: 0.00256 },
        { x: -5, y: 0.00396 },
        { x: -2, y: 0.00511 },
        { x: -1, y: 0.00555 },
        { x: 0, y: 0.00603 },
        { x: 0.01, y: 0.00604 },
      ],
      strokeColor: "#FFD700",
      strokeWidth: 2.5,
    },
    {
      id: "liquid-solid",
      points: [
        { x: 0.01, y: 0.00604 },
        { x: 0, y: 1 },
        { x: -2.5, y: 325 },
        { x: -5, y: 596 },
        { x: -7.5, y: 863 },
        { x: -10, y: 1119 },
        { x: -12.5, y: 1366 },
        { x: -15, y: 1574 },
        { x: -17.5, y: 1778 },
        { x: -20, y: 1978 },
        { x: -22.1, y: 2131 },
      ],
      strokeColor: "#FFD700",
      strokeWidth: 2.5,
    },
    {
      id: "gas-liquid",
      points: [
        { x: 0.01, y: 0.00604 },
        { x: 1, y: 0.00649 },
        { x: 2, y: 0.00697 },
        { x: 3, y: 0.00748 },
        { x: 5, y: 0.00861 },
        { x: 10, y: 0.0121 },
        { x: 15, y: 0.01683 },
        { x: 20, y: 0.0231 },
        { x: 25, y: 0.03127 },
        { x: 30, y: 0.0419 },
        { x: 35, y: 0.05552 },
        { x: 40, y: 0.0727 },
        { x: 45, y: 0.09466 },
        { x: 50, y: 0.1218 },
        { x: 55, y: 0.1555 },
        { x: 60, y: 0.1964 },
        { x: 70, y: 0.3077 },
        { x: 80, y: 0.4552 },
        { x: 90, y: 0.6919 },
        { x: 100, y: 1.0 },
        { x: 110, y: 1.414 },
        { x: 120, y: 1.959 },
        { x: 140, y: 3.567 },
        { x: 160, y: 6.101 },
        { x: 180, y: 9.896 },
        { x: 200, y: 15.34 },
        { x: 220, y: 23.18 },
        { x: 240, y: 33.38 },
        { x: 260, y: 46.95 },
        { x: 280, y: 64.12 },
        { x: 300, y: 85.88 },
        { x: 320, y: 112.8 },
        { x: 340, y: 147.3 },
        { x: 360, y: 186.7 },
        { x: 374.15, y: 218.3 },
      ],
      strokeColor: "#FFD700",
      strokeWidth: 2.5,
    },
    {
      id: "supercritical-divider",
      points: [
        { x: 374.15, y: 218.3 },
        { x: 374.15, y: 1900 },
      ],
      strokeColor: "transparent",
      strokeWidth: 0,
    },
  ],
  regions: [
    {
      name: "Gas",
      fillColor: "#fff5e6",
      opacity: 0.5,
      lowerBoundary: "gas-solid",
      upperBoundary: "axis-max",
    },
    {
      name: "Gas",
      fillColor: "#fff5e6",
      opacity: 0.5,
      lowerBoundary: "gas-liquid",
      upperBoundary: "axis-max",
    },
    {
      name: "Solid",
      fillColor: "#a8d5ff",
      opacity: 0.3,
      lowerBoundary: "axis-min",
      upperBoundary: "gas-solid",
    },
    {
      name: "Solid",
      fillColor: "#a8d5ff",
      opacity: 0.3,
      lowerBoundary: "axis-min",
      upperBoundary: "liquid-solid",
    },
    {
      name: "Liquid",
      fillColor: "#6bb6ff",
      opacity: 0.4,
      lowerBoundary: "liquid-solid",
      upperBoundary: "gas-liquid",
    },
    {
      name: "Liquid",
      fillColor: "#6bb6ff",
      opacity: 0.4,
      lowerBoundary: "liquid-solid",
      upperBoundary: "supercritical-divider",
    },
    {
      name: "Supercritical Fluid",
      fillColor: "#ff9dd6",
      opacity: 0.35,
      lowerBoundary: "supercritical-divider",
      upperBoundary: "axis-max",
    },
  ],
  labels: [
    {
      label: "Solid",
      x: -140,
      y: 4,
      fontSize: 16,
      color: "#fff",
      fontWeight: "bold" as const,
      textAnchor: "middle" as const,
    },
    {
      label: "Liquid",
      x: 12,
      y: 12,
      fontSize: 16,
      color: "#fff",
      fontWeight: "bold" as const,
      textAnchor: "middle" as const,
    },
    {
      label: "Gas",
      x: 180,
      y: 0.08,
      fontSize: 16,
      color: "#fff",
      fontWeight: "bold" as const,
      textAnchor: "middle" as const,
    },
    {
      label: "SCF",
      x: 850,
      y: 500,
      fontSize: 15,
      color: "#fff",
      fontWeight: "bold" as const,
      textAnchor: "middle" as const,
    },
  ],
};
