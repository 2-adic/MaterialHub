import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, {
  Line,
  Circle,
  Text as SvgText,
  G,
  Defs,
  ClipPath,
  Rect,
  Polygon,
} from "react-native-svg";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Marker, { MarkerProps } from "./Marker";

interface ChartRenderProps {
  valueToScreenX: (value: number) => number;
  valueToScreenY: (value: number) => number;
  padding: { top: number; right: number; bottom: number; left: number };
  width: number;
  height: number;
  chartWidth: number;
  chartHeight: number;
}

interface ChartProps {
  xAxisMin: number;
  xAxisMax: number;
  yAxisMin: number;
  yAxisMax: number;
  xAxisTicks: number[];
  yAxisTicks: number[];
  xScale: (value: number) => number;
  yScale: (value: number) => number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  touchValuePrecision?: number;
  touchValueThreshold?: number;
  width?: number;
  height?: number;
  markers?: MarkerProps[];
  children?: React.ReactNode | ((helpers: ChartRenderProps) => React.ReactNode);
  onTouchChange?: (coords: { x: number; y: number } | null) => void;
  infoBoxRenderer?: (
    info: TouchInfo | null,
    labels: { xAxisLabel: string; yAxisLabel: string }
  ) => React.ReactNode;
}

interface TouchInfo {
  x: number;
  y: number;
  displayX: string;
  displayY: string;
}

const Chart: React.FC<ChartProps> = ({
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
  xAxisLabel = "X Axis",
  yAxisLabel = "Y Axis",
  touchValuePrecision = 3,
  touchValueThreshold = 0.001,
  markers = [],
  children,
  onTouchChange,
  infoBoxRenderer,
}) => {
  const [touchInfo, setTouchInfo] = useState<TouchInfo | null>(null);

  // Chart dimensions
  const padding = { top: 40, right: 40, bottom: 60, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const clamp = (value: number, minValue: number, maxValue: number) =>
    Math.min(maxValue, Math.max(minValue, value));

  const invertScaleValue = (
    target: number,
    minValue: number,
    maxValue: number,
    scaleFn: (value: number) => number
  ) => {
    let low = minValue;
    let high = maxValue;
    let mid = low;

    const iterations = 64;
    for (let i = 0; i < iterations; i++) {
      mid = (low + high) / 2;
      const scaledMid = scaleFn(mid);

      if (scaledMid === target || Math.abs(high - low) < 1e-9) {
        break;
      }

      if (scaledMid < target) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return clamp(mid, minValue, maxValue);
  };

  // Convert data values to screen coordinates using the provided scale functions
  const valueToScreenX = (value: number): number => {
    const scaledValue = xScale(value);
    const normalized =
      (scaledValue - xScale(xAxisMin)) / (xScale(xAxisMax) - xScale(xAxisMin));
    return padding.left + normalized * chartWidth;
  };

  const valueToScreenY = (value: number): number => {
    const scaledValue = yScale(value);
    const normalized =
      (scaledValue - yScale(yAxisMin)) / (yScale(yAxisMax) - yScale(yAxisMin));
    return height - padding.bottom - normalized * chartHeight;
  };

  // Inverse functions to convert screen coordinates back to data values
  const screenXToValue = (x: number): number => {
    const normalized = clamp((x - padding.left) / chartWidth, 0, 1);
    const minScaled = xScale(xAxisMin);
    const maxScaled = xScale(xAxisMax);
    const targetScaled = minScaled + normalized * (maxScaled - minScaled);
    const clampedTarget = clamp(
      targetScaled,
      Math.min(minScaled, maxScaled),
      Math.max(minScaled, maxScaled)
    );
    return invertScaleValue(clampedTarget, xAxisMin, xAxisMax, xScale);
  };

  const screenYToValue = (y: number): number => {
    const normalized = clamp((height - padding.bottom - y) / chartHeight, 0, 1);
    const minScaled = yScale(yAxisMin);
    const maxScaled = yScale(yAxisMax);
    const targetScaled = minScaled + normalized * (maxScaled - minScaled);
    const clampedTarget = clamp(
      targetScaled,
      Math.min(minScaled, maxScaled),
      Math.max(minScaled, maxScaled)
    );
    return invertScaleValue(clampedTarget, yAxisMin, yAxisMax, yScale);
  };

  const formatValue = (value: number): string => {
    // Remove unnecessary trailing zeros and decimal points
    const formatted = value.toString();

    // If it contains a decimal point, remove unnecessary trailing zeros
    if (formatted.includes(".")) {
      return formatted.replace(/\.?0+$/, "");
    }

    return formatted;
  };

  const formatTouchValue = (value: number): string => {
    // Check if value is below threshold
    if (Math.abs(value) < touchValueThreshold) {
      return "0";
    }
    // Format to specified significant digits
    return value.toPrecision(touchValuePrecision);
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
        const xValue = screenXToValue(x);
        const yValue = screenYToValue(y);

        setTouchInfo({
          x: xValue,
          y: yValue,
          displayX: formatTouchValue(xValue),
          displayY: formatTouchValue(yValue),
        });
        if (onTouchChange) {
          onTouchChange({ x: xValue, y: yValue });
        }
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
        const xValue = screenXToValue(x);
        const yValue = screenYToValue(y);

        setTouchInfo({
          x: xValue,
          y: yValue,
          displayX: formatTouchValue(xValue),
          displayY: formatTouchValue(yValue),
        });
        if (onTouchChange) {
          onTouchChange({ x: xValue, y: yValue });
        }
      }
    })
    .onEnd(() => {
      setTouchInfo(null);
      if (onTouchChange) {
        onTouchChange(null);
      }
    });

  // Generate grid lines based on provided ticks
  const generateXGridLines = () => {
    return xAxisTicks.map((tick) => {
      const x = valueToScreenX(tick);
      return (
        <G key={`x-tick-${tick}`}>
          <Line
            x1={x}
            y1={padding.top}
            x2={x}
            y2={height - padding.bottom}
            stroke="#e0e0e0"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          <SvgText
            x={x}
            y={height - padding.bottom + 20}
            fontSize="12"
            fill="#fff"
            textAnchor="middle"
          >
            {formatValue(tick)}
          </SvgText>
        </G>
      );
    });
  };

  const generateYGridLines = () => {
    return yAxisTicks.map((tick) => {
      const y = valueToScreenY(tick);
      return (
        <G key={`y-tick-${tick}`}>
          <Line
            x1={padding.left}
            y1={y}
            x2={width - padding.right}
            y2={y}
            stroke="#e0e0e0"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          <SvgText
            x={padding.left - 10}
            y={y + 4}
            fontSize="12"
            fill="#fff"
            textAnchor="end"
          >
            {formatValue(tick)}
          </SvgText>
        </G>
      );
    });
  };

  const generateMarkerTickMarks = () => {
    return markers
      .filter((marker) => marker.showTickMarks !== false)
      .map((marker, index) => {
        const screenX = valueToScreenX(marker.x);
        const screenY = valueToScreenY(marker.y);
        const tickColor = marker.tickMarkColor ?? "#e0e0e0";
        const tickStrokeWidth = marker.tickMarkStrokeWidth ?? 2;
        const tickDashArray = marker.tickMarkDashArray ?? "2,2";
        const tickLabelWeight = marker.tickMarkLabelFontWeight ?? "bold";
        return (
          <G key={`marker-ticks-${index}`}>
            {/* Vertical tick line */}
            <Line
              x1={screenX}
              y1={padding.top}
              x2={screenX}
              y2={height - padding.bottom}
              stroke={tickColor}
              strokeWidth={tickStrokeWidth}
              strokeDasharray={tickDashArray}
            />
            {/* Horizontal tick line */}
            <Line
              x1={padding.left}
              y1={screenY}
              x2={width - padding.right}
              y2={screenY}
              stroke={tickColor}
              strokeWidth={tickStrokeWidth}
              strokeDasharray={tickDashArray}
            />
            {/* X-axis label */}
            <SvgText
              x={screenX}
              y={height - padding.bottom + 20}
              fontSize="12"
              fill="#fff"
              textAnchor="middle"
              fontWeight={tickLabelWeight}
            >
              {formatValue(marker.x)}
            </SvgText>
            {/* Y-axis label */}
            <SvgText
              x={padding.left - 10}
              y={screenY + 4}
              fontSize="12"
              fill="#fff"
              textAnchor="end"
              fontWeight={tickLabelWeight}
            >
              {formatValue(marker.y)}
            </SvgText>
          </G>
        );
      });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.chartContainer}>
        <GestureDetector gesture={panGesture}>
          <Svg width={width} height={height}>
            <Defs>
              <ClipPath id="chart-clip">
                <Rect
                  x={padding.left}
                  y={padding.top}
                  width={chartWidth}
                  height={chartHeight}
                />
              </ClipPath>
            </Defs>

            {/* Grid lines */}
            {generateXGridLines()}
            {generateYGridLines()}

            {/* Custom content passed as children or render-prop - clipped to chart area */}
            <G clipPath="url(#chart-clip)">
              {typeof children === "function"
                ? (children as (helpers: ChartRenderProps) => React.ReactNode)({
                    valueToScreenX,
                    valueToScreenY,
                    padding,
                    width,
                    height,
                    chartWidth,
                    chartHeight,
                  })
                : children}
            </G>

            {/* Axes - rendered after boundaries so they appear on top */}
            <Line
              x1={padding.left}
              y1={padding.top + 10}
              x2={padding.left}
              y2={height - padding.bottom + 1}
              stroke="#fff"
              strokeWidth="2"
            />
            <Line
              x1={padding.left - 1}
              y1={height - padding.bottom}
              x2={width - padding.right - 10}
              y2={height - padding.bottom}
              stroke="#fff"
              strokeWidth="2"
            />

            {/* Axis arrows */}
            {/* Y-axis arrow (pointing up) */}
            <Polygon
              points={`${padding.left},${padding.top} ${padding.left - 5},${
                padding.top + 10
              } ${padding.left + 5},${padding.top + 10}`}
              fill="#fff"
            />
            {/* X-axis arrow (pointing right) */}
            <Polygon
              points={`${width - padding.right},${height - padding.bottom} ${
                width - padding.right - 10
              },${height - padding.bottom - 5} ${width - padding.right - 10},${
                height - padding.bottom + 5
              }`}
              fill="#fff"
            />

            {/* Axis labels */}
            <SvgText
              x={width / 2}
              y={height - 15}
              fontSize="14"
              fill="#fff"
              fontWeight="bold"
              textAnchor="middle"
            >
              {xAxisLabel}
            </SvgText>
            <SvgText
              x={20}
              y={height / 2}
              fontSize="14"
              fill="#fff"
              fontWeight="bold"
              textAnchor="middle"
              transform={"rotate(-90, 20, " + height / 2 + ")"}
            >
              {yAxisLabel}
            </SvgText>

            {/* Marker tick marks - rendered after regions so they appear on top */}
            {generateMarkerTickMarks()}

            {/* Markers */}
            {markers.map((marker, index) => (
              <Marker
                key={`marker-${index}`}
                x={valueToScreenX(marker.x)}
                y={valueToScreenY(marker.y)}
                radius={marker.radius}
                color={marker.color}
                strokeColor={marker.strokeColor}
                strokeWidth={marker.strokeWidth}
                label={marker.label}
                labelOffsetX={marker.labelOffsetX}
                labelOffsetY={marker.labelOffsetY}
                labelFontSize={marker.labelFontSize}
                labelColor={marker.labelColor}
                labelFontWeight={marker.labelFontWeight}
                labelTextAnchor={marker.labelTextAnchor}
              />
            ))}

            {/* Touch indicator */}
            {touchInfo && (
              <Circle
                cx={valueToScreenX(touchInfo.x)}
                cy={valueToScreenY(touchInfo.y)}
                r="8"
                fill="rgba(255, 0, 0, 0.5)"
                stroke="#ff0000"
                strokeWidth="2"
              />
            )}
          </Svg>
        </GestureDetector>
        <View style={styles.infoBox}>
          {infoBoxRenderer ? (
            infoBoxRenderer(touchInfo, { xAxisLabel, yAxisLabel })
          ) : touchInfo ? (
            <>
              <Text style={styles.infoText}>
                {xAxisLabel}: {touchInfo.displayX}
              </Text>
              <Text style={styles.infoText}>
                {yAxisLabel}: {touchInfo.displayY}
              </Text>
            </>
          ) : (
            <Text style={styles.infoPlaceholder}>
              Touch the chart to see coordinates
            </Text>
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
});

export default Chart;
