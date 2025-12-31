import React from 'react';
import Svg, { Polygon, SvgProps } from 'react-native-svg';

interface HexagonProps extends SvgProps {
    size: number;
    color?: string;
    stroke?: string;
    strokeWidth?: number;
}

export const Hexagon = ({ size, color = 'transparent', stroke, strokeWidth = 0, ...props }: HexagonProps) => {
    // A regular hexagon logic
    // Points for a hexagon fitting in a square of size `size`
    // Center is size/2, size/2
    const center = size / 2;
    const r = size / 2;

    // Points calculation (flat topped)
    // 0: (center - r/2, 0) WRONG for flat topped? 
    // Let's use Pointy Topped for better avatar fit usually, or Flat Topped? 
    // Iron Man / SciFi usually uses Flat Topped (side up).
    // Let's calculate points for a Flat Topped Hexagon.
    // 0: (r/2, 0) 
    // 1: (size - r/2, 0)
    // 2: (size, center)
    // 3: (size - r/2, size)
    // 4: (r/2, size)
    // 5: (0, center)

    // Wait, simple geometry for flat topped:
    // x = center + r * cos(angle)
    // y = center + r * sin(angle)
    // angles: 0, 60, 120, 180, 240, 300
    // 0 deg is right. So flat topped is actually 30, 90, 150... ? No.
    // Pointy topped has a point at 270 (top).
    // Let's do Pointy Topped (Vertex at top).

    const points = [
        `${center},0`, // Top
        `${size},${size * 0.25}`, // Top Right
        `${size},${size * 0.75}`, // Bottom Right
        `${center},${size}`, // Bottom
        `0,${size * 0.75}`, // Bottom Left
        `0,${size * 0.25}` // Top Left
    ].join(' ');

    return (
        <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`} {...props}>
            <Polygon
                points={points}
                fill={color}
                stroke={stroke}
                strokeWidth={strokeWidth}
            />
        </Svg>
    );
};
