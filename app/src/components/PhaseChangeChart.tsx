import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, {
  Line,
  Path,
  Circle,
  Text as SvgText,
  G,
  Rect,
} from "react-native-svg";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

interface PhaseChangeChartProps {
  width?: number;
  height?: number;
}

interface PhaseInfo {
  temperature: number;
  pressure: number;
  phase: string;
}

const PhaseChangeChart: React.FC<PhaseChangeChartProps> = ({
  width = Dimensions.get("window").width - 40,
  height = 400,
}) => {
  const [touchInfo, setTouchInfo] = useState<PhaseInfo | null>(null);

  // Chart dimensions
  const padding = { top: 40, right: 40, bottom: 60, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Water phase diagram key points (simplified)
  // Temperature in Celsius, Pressure in atm
  const triplePoint = { temp: 0.01, pressure: 0.006 };
  const normalBoiling = { temp: 100, pressure: 1 };
  const normalFreezing = { temp: 0, pressure: 1 };
  const criticalPoint = { temp: 374, pressure: 218 };

  // Scale ranges (Celsius)
  const tempMin = -272; // ~1 K in Celsius
  const tempMax = 1500; // 700 K in Celsius
  const pressureMin = 0.001;
  const pressureMax = 1500;
  const linearTempBreak = 0; // 0°C - switch from linear to log here
  const linearTempFraction = 0.2; // Use 20% of x-axis for low temps to 0°C

  // Convert data coordinates to screen coordinates
  const tempToX = (temp: number) => {
    if (temp <= linearTempBreak) {
      // Linear scale from 0K to 273.15K (0°C)
      const linearWidth = chartWidth * linearTempFraction;
      return (
        ((temp - tempMin) / (linearTempBreak - tempMin)) * linearWidth +
        padding.left
      );
    } else {
      // Logarithmic scale from 273.15K to tempMax
      const logStart = padding.left + chartWidth * linearTempFraction;
      const logWidth = chartWidth * (1 - linearTempFraction);
      const logTemp = Math.log10(temp - linearTempBreak + 1);
      const logMax = Math.log10(tempMax - linearTempBreak + 1);
      return (logTemp / logMax) * logWidth + logStart;
    }
  };

  const pressureToY = (pressure: number) => {
    const linearPressureBreak = 0.006; // Triple point pressure - switch from linear to log here
    const linearPressureFraction = 0.2; // Use 20% of y-axis for low pressures to 0.006 atm

    if (pressure <= linearPressureBreak) {
      // Linear scale from pressureMin to 0.006 atm
      const linearHeight = chartHeight * linearPressureFraction;
      return (
        height -
        padding.bottom -
        ((pressure - pressureMin) / (linearPressureBreak - pressureMin)) *
          linearHeight
      );
    } else {
      // Logarithmic scale from 0.006 atm to pressureMax
      const logStart =
        height - padding.bottom - chartHeight * linearPressureFraction;
      const logHeight = chartHeight * (1 - linearPressureFraction);
      const logPressure = Math.log10(pressure);
      const logMin = Math.log10(linearPressureBreak);
      const logMax = Math.log10(pressureMax);
      return (
        logStart - ((logPressure - logMin) / (logMax - logMin)) * logHeight
      );
    }
  };

  // Inverse functions
  const xToTemp = (x: number) => {
    const linearEnd = padding.left + chartWidth * linearTempFraction;
    if (x <= linearEnd) {
      // Linear region
      const linearWidth = chartWidth * linearTempFraction;
      const normalizedX = (x - padding.left) / linearWidth;
      return normalizedX * (linearTempBreak - tempMin) + tempMin;
    } else {
      // Logarithmic region
      const logWidth = chartWidth * (1 - linearTempFraction);
      const normalizedX = (x - linearEnd) / logWidth;
      const logMax = Math.log10(tempMax - linearTempBreak + 1);
      const logTemp = normalizedX * logMax;
      return Math.pow(10, logTemp) - 1 + linearTempBreak;
    }
  };

  const yToPressure = (y: number) => {
    const linearPressureBreak = 0.006;
    const linearPressureFraction = 0.2;
    const linearEnd =
      height - padding.bottom - chartHeight * linearPressureFraction;

    if (y >= linearEnd) {
      // Linear region (bottom 20% of chart)
      const linearHeight = chartHeight * linearPressureFraction;
      const normalizedY = (height - padding.bottom - y) / linearHeight;
      const calculatedPressure =
        normalizedY * (linearPressureBreak - pressureMin) + pressureMin;
      // Clamp to ensure we stay in linear range
      return Math.max(
        pressureMin,
        Math.min(linearPressureBreak, calculatedPressure)
      );
    } else {
      // Logarithmic region (top 80% of chart)
      const logHeight = chartHeight * (1 - linearPressureFraction);
      const normalizedY = (linearEnd - y) / logHeight;
      const logMin = Math.log10(linearPressureBreak);
      const logMax = Math.log10(pressureMax);
      const logPressure = normalizedY * (logMax - logMin) + logMin;
      const calculatedPressure = Math.pow(10, logPressure);
      // Clamp to ensure we stay in log range
      return Math.max(
        linearPressureBreak,
        Math.min(pressureMax, calculatedPressure)
      );
    }
  };

  const formatPressure = (pressure: number) => {
    if (pressure >= 1) {
      return pressure.toFixed(2);
    }
    if (pressure >= 0.01) {
      return pressure.toFixed(3);
    }
    return pressure.toFixed(4);
  };

  // Determine phase based on temperature and pressure
  const determinePhase = (temp: number, pressure: number): string => {
    // Above critical point
    if (temp >= criticalPoint.temp && pressure >= criticalPoint.pressure) {
      return "Supercritical Fluid";
    }

    // Below triple point pressure - sublimation region
    if (pressure < triplePoint.pressure) {
      // Sublimation curve - exponential growth from low temp to triple point
      const t = (temp - tempMin) / (triplePoint.temp - tempMin);
      const sublimationPressure =
        0.001 + Math.pow(Math.max(0, t), 2) * (triplePoint.pressure - 0.001);
      return pressure < sublimationPressure ? "Gas" : "Solid";
    }

    // Melting curve (solid-liquid boundary) - slightly negative slope
    // Goes from triple point upward with slight negative slope
    const meltingTemp =
      triplePoint.temp - 0.0075 * (pressure - triplePoint.pressure);

    // Vaporization curve (liquid-gas boundary) - from triple point to critical point
    // Using same exponential formula as the drawn curve
    const t =
      (pressure - triplePoint.pressure) /
      (criticalPoint.pressure - triplePoint.pressure);
    const vaporTemp =
      triplePoint.temp +
      Math.pow(t, 1 / 1.5) * (criticalPoint.temp - triplePoint.temp);

    // Determine phase based on position relative to boundaries
    if (temp < meltingTemp) {
      return "Solid";
    } else if (temp > vaporTemp) {
      return "Gas";
    } else {
      return "Liquid";
    }
  };

  // Generate phase boundary paths
  const generateSolidLiquidBoundary = () => {
    let path = `M ${tempToX(triplePoint.temp)},${pressureToY(
      triplePoint.pressure
    )}`;
    // Slightly negative slope to high pressure region - extend to top of chart
    const points = [
      { temp: triplePoint.temp, pressure: triplePoint.pressure },
      { temp: -5, pressure: 50 },
      { temp: -10, pressure: 100 },
      { temp: -15, pressure: 200 },
      { temp: -20, pressure: 400 },
      { temp: -25, pressure: 600 },
      { temp: -30, pressure: 800 },
      { temp: -35, pressure: 1000 },
      { temp: -40, pressure: 1200 },
      { temp: -45, pressure: pressureMax },
    ];
    points.forEach((point) => {
      path += ` L ${tempToX(point.temp)},${pressureToY(point.pressure)}`;
    });
    return path;
  };

  const generateLiquidGasBoundary = () => {
    let path = `M ${tempToX(triplePoint.temp)},${pressureToY(
      triplePoint.pressure
    )}`;
    // Exponential curve from triple point to critical point
    const numPoints = 50;
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const temp =
        triplePoint.temp + t * (criticalPoint.temp - triplePoint.temp);
      const pressure =
        triplePoint.pressure +
        Math.pow(t, 1.5) * (criticalPoint.pressure - triplePoint.pressure);
      path += ` L ${tempToX(temp)},${pressureToY(pressure)}`;
    }
    return path;
  };

  const generateSolidGasBoundary = () => {
    let path = `M ${tempToX(tempMin)},${pressureToY(0.001)}`;
    // Curve from low temp to triple point
    const numPoints = 30;
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const temp = tempMin + t * (triplePoint.temp - tempMin);
      const pressure = 0.001 + Math.pow(t, 2) * (triplePoint.pressure - 0.001);
      path += ` L ${tempToX(temp)},${pressureToY(pressure)}`;
    }
    return path;
  };

  // Handle touch gestures
  const panGesture = Gesture.Pan()
    .minDistance(0)
    .onBegin((event) => {
      const x = event.x;
      const y = event.y;

      // Check if within chart bounds
      if (
        x >= padding.left &&
        x <= width - padding.right &&
        y >= padding.top &&
        y <= height - padding.bottom
      ) {
        const temp = xToTemp(x);
        const pressure = yToPressure(y);
        const phase = determinePhase(temp, pressure);

        setTouchInfo({
          temperature: temp,
          pressure,
          phase,
        });
      }
    })
    .onUpdate((event) => {
      const x = event.x;
      const y = event.y;

      // Check if within chart bounds
      if (
        x >= padding.left &&
        x <= width - padding.right &&
        y >= padding.top &&
        y <= height - padding.bottom
      ) {
        const temp = xToTemp(x);
        const pressure = yToPressure(y);
        const phase = determinePhase(temp, pressure);

        setTouchInfo({
          temperature: temp,
          pressure,
          phase,
        });
      }
    })
    .onEnd(() => {
      setTouchInfo(null);
    });

  // Generate grid lines
  const generateTempGridLines = () => {
    // Include 0°C as a key gridline, plus others
    const temps = [0.01, 100, 374]; // 0.01: triple point, 374: critical point temp
    return temps.map((temp) => {
      return (
        <G key={`temp-${temp}`}>
          <Line
            x1={tempToX(temp)}
            y1={padding.top}
            x2={tempToX(temp)}
            y2={height - padding.bottom}
            stroke="#e0e0e0"
            strokeWidth={temp === 0.01 || temp === 374 ? "2" : "1"}
            strokeDasharray={temp === 0.01 || temp === 374 ? "2,2" : "4,4"}
          />
          <SvgText
            x={tempToX(temp)}
            y={height - padding.bottom + 20}
            fontSize="12"
            fill="#fff"
            textAnchor="middle"
            fontWeight={temp === 0.01 || temp === 374 ? "bold" : "normal"}
          >
            {temp}
          </SvgText>
        </G>
      );
    });
  };

  const generatePressureGridLines = () => {
    const pressures = [0.006, 1, 217.7]; // 0.006: triple point, 217.7: critical point pressure
    return pressures.map((pressure) => (
      <G key={`pressure-${pressure}`}>
        <Line
          x1={padding.left}
          y1={pressureToY(pressure)}
          x2={width - padding.right}
          y2={pressureToY(pressure)}
          stroke="#e0e0e0"
          strokeWidth={pressure === 0.006 || pressure === 217.7 ? "2" : "1"}
          strokeDasharray={
            pressure === 0.006 || pressure === 217.7 ? "2,2" : "4,4"
          }
        />
        <SvgText
          x={padding.left - 10}
          y={pressureToY(pressure) + 4}
          fontSize="12"
          fill="#fff"
          textAnchor="end"
          fontWeight={
            pressure === 0.006 || pressure === 217.7 ? "bold" : "normal"
          }
        >
          {pressure}
        </SvgText>
      </G>
    ));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.chartContainer}>
        <GestureDetector gesture={panGesture}>
          <Svg width={width} height={height}>
            {/* Background regions with colors */}
            {/* Solid region - left of melting curve and below sublimation curve */}
            <Path
              d={`M ${padding.left},${height - padding.bottom} L ${
                padding.left
              },${padding.top} L ${tempToX(-45)},${padding.top} L ${tempToX(
                -45
              )},${pressureToY(pressureMax)} L ${tempToX(-40)},${pressureToY(
                1200
              )} L ${tempToX(-35)},${pressureToY(1000)} L ${tempToX(
                -30
              )},${pressureToY(800)} L ${tempToX(-25)},${pressureToY(
                600
              )} L ${tempToX(-20)},${pressureToY(400)} L ${tempToX(
                -15
              )},${pressureToY(200)} L ${tempToX(-10)},${pressureToY(
                100
              )} L ${tempToX(-5)},${pressureToY(50)} L ${tempToX(
                triplePoint.temp
              )},${pressureToY(triplePoint.pressure)} L ${tempToX(
                tempMin
              )},${pressureToY(0.001)} L ${padding.left},${
                height - padding.bottom
              } Z`}
              fill="#a8d5ff"
              opacity={0.3}
            />

            {/* Liquid region - between melting and vaporization curves */}
            <Path
              d={`${generateSolidLiquidBoundary()} L ${tempToX(
                -45
              )},${pressureToY(pressureMax)} L ${tempToX(-45)},${
                padding.top
              } L ${width - padding.right},${padding.top} L ${
                width - padding.right
              },${pressureToY(criticalPoint.pressure)} L ${tempToX(
                criticalPoint.temp
              )},${pressureToY(
                criticalPoint.pressure
              )} ${generateLiquidGasBoundary().replace("M", "L")} Z`}
              fill="#6bb6ff"
              opacity={0.4}
            />

            {/* Gas region - right of vaporization and sublimation curves */}
            <Path
              d={`${generateSolidGasBoundary()} L ${tempToX(
                triplePoint.temp
              )},${pressureToY(
                triplePoint.pressure
              )} ${generateLiquidGasBoundary().replace("M", "L")} L ${tempToX(
                criticalPoint.temp
              )},${pressureToY(criticalPoint.pressure)} L ${
                width - padding.right
              },${pressureToY(criticalPoint.pressure)} L ${
                width - padding.right
              },${height - padding.bottom} L ${tempToX(tempMin)},${
                height - padding.bottom
              } Z`}
              fill="#fff5e6"
              opacity={0.5}
            />

            {/* Grid lines */}
            {generateTempGridLines()}
            {generatePressureGridLines()}

            {/* Axes */}
            <Line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={height - padding.bottom}
              stroke="#fff"
              strokeWidth="2"
            />
            <Line
              x1={padding.left}
              y1={height - padding.bottom}
              x2={width - padding.right}
              y2={height - padding.bottom}
              stroke="#fff"
              strokeWidth="2"
            />

            {/* Phase boundary lines */}
            <Path
              d={generateSolidLiquidBoundary()}
              stroke="#FFD700"
              strokeWidth="2.5"
              fill="none"
            />
            <Path
              d={generateLiquidGasBoundary()}
              stroke="#FFD700"
              strokeWidth="2.5"
              fill="none"
            />
            <Path
              d={generateSolidGasBoundary()}
              stroke="#FFD700"
              strokeWidth="2.5"
              fill="none"
            />

            {/* Key points */}
            {/* Triple Point */}
            <Circle
              cx={tempToX(triplePoint.temp)}
              cy={pressureToY(triplePoint.pressure)}
              r="5"
              fill="#00FF00"
              stroke="#fff"
              strokeWidth="2"
            />
            <SvgText
              x={tempToX(triplePoint.temp) + 15}
              y={pressureToY(triplePoint.pressure) - 10}
              fontSize="11"
              fill="#00FF00"
              fontWeight="bold"
            >
              Triple Point
            </SvgText>

            {/* Critical Point */}
            <Circle
              cx={tempToX(criticalPoint.temp)}
              cy={pressureToY(criticalPoint.pressure)}
              r="6"
              fill="#FF0000"
              stroke="#fff"
              strokeWidth="2"
            />
            <SvgText
              x={tempToX(criticalPoint.temp) - 10}
              y={pressureToY(criticalPoint.pressure) - 15}
              fontSize="11"
              fill="#FF0000"
              fontWeight="bold"
              textAnchor="end"
            >
              Critical Point
            </SvgText>

            {/* Normal conditions point (0°C, 1 atm) */}
            <Circle
              cx={tempToX(0)}
              cy={pressureToY(1)}
              r="4"
              fill="#666"
              opacity={0.7}
            />

            {/* Labels */}
            <SvgText
              x={width / 2}
              y={height - 15}
              fontSize="14"
              fill="#fff"
              fontWeight="bold"
              textAnchor="middle"
            >
              Temperature (°C)
            </SvgText>
            <SvgText
              x={20}
              y={height / 2}
              fontSize="14"
              fill="#fff"
              fontWeight="bold"
              textAnchor="middle"
              transform={`rotate(-90, 20, ${height / 2})`}
            >
              Pressure (atm)
            </SvgText>

            {/* Phase labels */}
            <SvgText
              x={tempToX(-130)}
              y={pressureToY(4)}
              fontSize="16"
              fill="#fff"
              fontWeight="bold"
              textAnchor="middle"
            >
              Solid
            </SvgText>
            <SvgText
              x={tempToX(4.8)}
              y={pressureToY(36)}
              fontSize="16"
              fill="#fff"
              fontWeight="bold"
              textAnchor="middle"
            >
              Liquid
            </SvgText>
            <SvgText
              x={tempToX(51)}
              y={pressureToY(0.12)}
              fontSize="16"
              fill="#fff"
              fontWeight="bold"
              textAnchor="middle"
            >
              Gas
            </SvgText>

            {/* Touch indicator */}
            {touchInfo && (
              <Circle
                cx={tempToX(touchInfo.temperature)}
                cy={pressureToY(touchInfo.pressure)}
                r="8"
                fill="rgba(255, 0, 0, 0.5)"
                stroke="#ff0000"
                strokeWidth="2"
              />
            )}
          </Svg>
        </GestureDetector>
        <View style={styles.infoBox}>
          {touchInfo ? (
            <>
              <Text style={styles.infoTitle}>Phase: {touchInfo.phase}</Text>
              <Text style={styles.infoText}>
                Temperature: {touchInfo.temperature.toFixed(1)}°C
              </Text>
              <Text style={styles.infoText}>
                Pressure: {formatPressure(touchInfo.pressure)} atm
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
          )}
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  chartContainer: {
    position: "relative",
    alignItems: "center",
  },
  infoBox: {
    marginTop: 16,
    padding: 16,
    width: "100%",
    alignItems: "center",
  },
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
