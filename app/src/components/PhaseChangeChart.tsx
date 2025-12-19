import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Path, Text as SvgText } from "react-native-svg";
import Chart from "./Chart";
import { MarkerProps } from "./Marker";

type XY = { x: number; y: number };

interface PhaseBoundary {
  points: XY[];
  strokeColor?: string;
  strokeWidth?: number;
  id: string; // Unique identifier for this boundary
}

interface PhaseArea {
  points: XY[];
  fillColor?: string;
  opacity?: number;
}

interface PhaseRegion {
  name: string;
  fillColor: string;
  opacity?: number;
  // Define the region by specifying its temperature boundaries (left/right)
  lowerBoundary?: string | "axis-min"; // ID of boundary or "axis-min" for xAxisMin (lowest temperature)
  upperBoundary?: string | "axis-max"; // ID of boundary or "axis-max" for xAxisMax (highest temperature)
}

interface PhaseLabel {
  label: string;
  x: number;
  y: number;
  fontSize?: number;
  color?: string;
  fontWeight?: "normal" | "bold";
  textAnchor?: "start" | "middle" | "end";
}

interface PhaseChangeChartProps {
  width?: number;
  height?: number;
  xAxisMin: number;
  xAxisMax: number;
  yAxisMin: number;
  yAxisMax: number;
  xAxisTicks: number[];
  yAxisTicks: number[];
  xScale: (value: number) => number;
  yScale: (value: number) => number;
  xAxisLabel: string;
  yAxisLabel: string;
  touchValuePrecision?: number;
  touchValueThreshold?: number;
  markers?: MarkerProps[];
  boundaries: PhaseBoundary[];
  regions: PhaseRegion[];
  labels: PhaseLabel[];
  // Optional: If you still want to provide pre-calculated areas (backwards compatibility)
  areas?: PhaseArea[];
}

interface PhaseInfo {
  temperature: number;
  pressure: number;
  phase: string;
}

const PhaseChangeChart: React.FC<PhaseChangeChartProps> = ({
  width = Dimensions.get("window").width - 40,
  height = 400,
  xAxisMin,
  xAxisMax,
  yAxisMin,
  yAxisMax,
  xAxisTicks,
  yAxisTicks,
  xScale,
  yScale,
  xAxisLabel,
  yAxisLabel,
  touchValuePrecision,
  touchValueThreshold,
  markers,
  boundaries,
  regions,
  labels,
  areas: manualAreas,
}) => {
  const [touchInfo, setTouchInfo] = useState<PhaseInfo | null>(null);

  // Pressure formatter
  const formatPressure = (pressure: number) => {
    if (pressure >= 1) {
      return pressure.toFixed(2);
    }
    if (pressure >= 0.01) {
      return pressure.toFixed(3);
    }
    return pressure.toFixed(4);
  };

  // Utility to build path from points
  const buildPathFromPoints = (
    pts: XY[],
    toX: (v: number) => number,
    toY: (v: number) => number
  ) => {
    if (!pts.length) return "";
    let d = `M ${toX(pts[0].x)},${toY(pts[0].y)}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${toX(pts[i].x)},${toY(pts[i].y)}`;
    }
    return d;
  };

  // Helper: Get temperature at a specific pressure from boundary points
  // Uses linear interpolation between points
  const getTemperatureAtPressure = (
    points: XY[],
    pressure: number
  ): number | null => {
    if (points.length === 0) return null;

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      const minP = Math.min(p1.y, p2.y);
      const maxP = Math.max(p1.y, p2.y);

      if (pressure >= minP && pressure <= maxP) {
        if (maxP === minP) {
          // Horizontal segment at constant pressure
          return p2.x;
        }
        const t = (pressure - p1.y) / (p2.y - p1.y);
        return p1.x + t * (p2.x - p1.x);
      }
    }

    return null;
  };

  const generatedAreas = useMemo(() => {
    if (manualAreas && manualAreas.length > 0) {
      return manualAreas;
    }

    const boundaryMap = new Map<string, PhaseBoundary>();
    boundaries.forEach((b) => boundaryMap.set(b.id, b));

    const result: PhaseArea[] = [];
    const numSamples = 400;
    const pressureRange = yAxisMax - yAxisMin;
    const pressureStep = pressureRange / numSamples;
    const pressureSamples = new Set<number>();

    for (let i = 0; i <= numSamples; i++) {
      pressureSamples.add(yAxisMin + i * pressureStep);
    }

    boundaries.forEach((boundary) => {
      boundary.points.forEach((pt) => {
        const clamped = Math.min(Math.max(pt.y, yAxisMin), yAxisMax);
        pressureSamples.add(clamped);
      });
    });

    const sortedPressures = Array.from(pressureSamples).sort((a, b) => a - b);

    const getBoundaryTemperature = (
      boundaryId: PhaseRegion["lowerBoundary"],
      pressure: number
    ): number | null => {
      if (!boundaryId || boundaryId === "axis-min") {
        return xAxisMin;
      }
      if (boundaryId === "axis-max") {
        return xAxisMax;
      }
      const boundary = boundaryMap.get(boundaryId);
      if (!boundary) {
        return null;
      }
      return getTemperatureAtPressure(boundary.points, pressure);
    };

    const flushSegment = (
      leftEdge: XY[],
      rightEdge: XY[],
      regionConfig: PhaseRegion
    ) => {
      if (leftEdge.length >= 2 && rightEdge.length === leftEdge.length) {
        const areaPoints = [...leftEdge, ...rightEdge.slice().reverse()];
        result.push({
          points: areaPoints,
          fillColor: regionConfig.fillColor,
          opacity: regionConfig.opacity ?? 0.3,
        });
      }
    };

    for (const region of regions) {
      let currentLeft: XY[] = [];
      let currentRight: XY[] = [];

      const closeCurrentSegment = () => {
        if (currentLeft.length > 0 && currentRight.length > 0) {
          flushSegment(currentLeft, currentRight, region);
        }
        currentLeft = [];
        currentRight = [];
      };

      for (const pressure of sortedPressures) {
        const leftTemp = getBoundaryTemperature(region.lowerBoundary, pressure);
        const rightTemp = getBoundaryTemperature(
          region.upperBoundary,
          pressure
        );

        if (
          leftTemp === null ||
          rightTemp === null ||
          Number.isNaN(leftTemp) ||
          Number.isNaN(rightTemp) ||
          leftTemp > rightTemp
        ) {
          closeCurrentSegment();
          continue;
        }

        currentLeft.push({ x: leftTemp, y: pressure });
        currentRight.push({ x: rightTemp, y: pressure });
      }

      closeCurrentSegment();
    }

    return result;
  }, [
    boundaries,
    regions,
    manualAreas,
    xAxisMin,
    xAxisMax,
    yAxisMin,
    yAxisMax,
  ]);

  // Determine phase by comparing temperature against left/right boundaries at a given pressure
  const determinePhase = (temperature: number, pressure: number): string => {
    const boundaryMap = new Map<string, PhaseBoundary>();
    boundaries.forEach((b) => boundaryMap.set(b.id, b));

    const getBoundaryTemperature = (
      boundaryId: PhaseRegion["lowerBoundary"]
    ): number | null => {
      if (!boundaryId || boundaryId === "axis-min") {
        return xAxisMin;
      }
      if (boundaryId === "axis-max") {
        return xAxisMax;
      }
      const boundary = boundaryMap.get(boundaryId);
      if (!boundary) {
        return null;
      }
      return getTemperatureAtPressure(boundary.points, pressure);
    };

    for (const region of regions) {
      const leftTemp = getBoundaryTemperature(region.lowerBoundary);
      const rightTemp = getBoundaryTemperature(region.upperBoundary);

      if (leftTemp === null || rightTemp === null || leftTemp > rightTemp) {
        continue;
      }

      if (temperature >= leftTemp && temperature <= rightTemp) {
        return region.name;
      }
    }

    return "Unknown";
  };

  // Use Chart's onTouchChange to compute phase info
  const handleTouchChange = (coords: { x: number; y: number } | null) => {
    if (!coords) {
      setTouchInfo(null);
      return;
    }
    const temp = coords.x;
    const pressure = coords.y;
    const phaseName = determinePhase(temp, pressure);
    setTouchInfo({ temperature: temp, pressure, phase: phaseName });
  };

  return (
    <Chart
      width={width}
      height={height}
      xAxisMin={xAxisMin}
      xAxisMax={xAxisMax}
      yAxisMin={yAxisMin}
      yAxisMax={yAxisMax}
      xAxisTicks={xAxisTicks}
      yAxisTicks={yAxisTicks}
      xScale={xScale}
      yScale={yScale}
      xAxisLabel={xAxisLabel}
      yAxisLabel={yAxisLabel}
      touchValuePrecision={touchValuePrecision}
      touchValueThreshold={touchValueThreshold}
      markers={markers}
      onTouchChange={handleTouchChange}
      infoBoxRenderer={(info, labels) =>
        info ? (
          <>
            {determinePhase ? (
              <Text style={styles.infoTitle}>
                Phase: {determinePhase(info.x, info.y)}
              </Text>
            ) : null}
            <Text style={styles.infoText}>
              {labels.xAxisLabel}: {info.x.toFixed(1)}
            </Text>
            <Text style={styles.infoText}>
              {labels.yAxisLabel}: {formatPressure(info.y)}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.infoPlaceholderSpacer}> </Text>
            <Text style={styles.infoPlaceholder}>
              Touch the chart to see phase information
            </Text>
            <Text style={styles.infoPlaceholderSpacer}> </Text>
          </>
        )
      }
    >
      {(ctx) => {
        const toX = ctx.valueToScreenX;
        const toY = ctx.valueToScreenY;
        const boundaryList = boundaries;
        const areaList = generatedAreas;
        const labelList = labels;
        return (
          <>
            {areaList.map((area, idx) => (
              <Path
                key={`area-${idx}`}
                d={`${buildPathFromPoints(area.points, toX, toY)} Z`}
                fill={area.fillColor ?? "#888"}
                opacity={area.opacity ?? 0.3}
              />
            ))}
            {boundaryList.map((b, idx) => (
              <Path
                key={`boundary-${idx}`}
                d={buildPathFromPoints(b.points, toX, toY)}
                stroke={b.strokeColor ?? "#FFD700"}
                strokeWidth={b.strokeWidth ?? 2}
                fill="none"
              />
            ))}
            {labelList.map((lab, idx) => (
              <SvgText
                key={`label-${idx}`}
                x={toX(lab.x)}
                y={toY(lab.y)}
                fontSize={lab.fontSize ?? 14}
                fill={lab.color ?? "#fff"}
                fontWeight={lab.fontWeight ?? "bold"}
                textAnchor={lab.textAnchor ?? "middle"}
              >
                {lab.label}
              </SvgText>
            ))}
          </>
        );
      }}
    </Chart>
  );
};

const styles = StyleSheet.create({
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: "#fff",
    marginTop: 4,
  },
  infoPlaceholder: {
    fontSize: 15,
    color: "#999",
    fontStyle: "italic",
  },
  infoPlaceholderSpacer: {
    fontSize: 15,
    color: "transparent",
    marginTop: 4,
  },
});

export default PhaseChangeChart;
