import React from "react";
import { Circle, Text as SvgText } from "react-native-svg";

export interface MarkerProps {
  x: number;
  y: number;
  radius?: number;
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
  label?: string;
  labelOffsetX?: number;
  labelOffsetY?: number;
  labelFontSize?: number;
  labelColor?: string;
  labelFontWeight?: "normal" | "bold";
  labelTextAnchor?: "start" | "middle" | "end";
  showTickMarks?: boolean;
  tickMarkColor?: string;
  tickMarkStrokeWidth?: number;
  tickMarkDashArray?: string;
  tickMarkLabelFontWeight?: "normal" | "bold";
}

const Marker: React.FC<MarkerProps> = ({
  x,
  y,
  radius = 6,
  color = "#FF0000",
  strokeColor = "#fff",
  strokeWidth = 2,
  label,
  labelOffsetX = -10,
  labelOffsetY = -15,
  labelFontSize = 11,
  labelColor,
  labelFontWeight = "bold",
  labelTextAnchor = "end",
}) => {
  return (
    <>
      <Circle
        cx={x}
        cy={y}
        r={radius}
        fill={color}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      {label && (
        <SvgText
          x={x + labelOffsetX}
          y={y + labelOffsetY}
          fontSize={labelFontSize}
          fill={labelColor || color}
          fontWeight={labelFontWeight}
          textAnchor={labelTextAnchor}
        >
          {label}
        </SvgText>
      )}
    </>
  );
};

export default Marker;
