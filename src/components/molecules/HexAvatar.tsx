import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import Svg, { ClipPath, Defs, Polygon, Image as SvgImage } from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface HexAvatarProps {
    size: number;
    source: string;
    borderColor?: string;
    isActive?: boolean; // Speaking/Spotlight
}

export const HexAvatar = ({ size, source, borderColor = 'rgba(255,255,255,0.2)', isActive = false }: HexAvatarProps) => {
    // Hexagon Points Logic (Same as atom, Pointy Top)
    const center = size / 2;
    const points = [
        `${center},0`,
        `${size},${size * 0.25}`,
        `${size},${size * 0.75}`,
        `${center},${size}`,
        `0,${size * 0.75}`,
        `0,${size * 0.25}`
    ].join(' ');

    // Animation for Active Speaker (Pulsing Border)
    const strokeWidth = useSharedValue(2);

    useEffect(() => {
        if (isActive) {
            strokeWidth.value = withRepeat(
                withSequence(
                    withTiming(6, { duration: 800 }),
                    withTiming(2, { duration: 800 })
                ),
                -1,
                true
            );
        } else {
            strokeWidth.value = withTiming(2);
        }
    }, [isActive]);

    // We can't animate SVG props directly with Animated.View easily without creating animated SVG components
    // For simplicity in this High-Fi implementation, we'll use a wrapper View scaling for the pulse 
    // inside the parent component, or just simpler SVG prop animation if possible.
    // Let's render the Svg with standard state for now or use `useAnimatedProps` if we wrap `Polygon`.

    const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);

    const animatedProps = useAnimatedProps(() => ({
        strokeWidth: strokeWidth.value
    }));

    return (
        <View style={{ width: size, height: size }}>
            <Svg height={size} width={size}>
                <Defs>
                    <ClipPath id="hexClip">
                        <Polygon points={points} />
                    </ClipPath>
                </Defs>

                {/* Masked Image */}
                <SvgImage
                    x="0"
                    y="0"
                    width={size}
                    height={size}
                    preserveAspectRatio="xMidYMid slice"
                    href={{ uri: source }}
                    clipPath="url(#hexClip)"
                />

                {/* Border / Active Glow */}
                <AnimatedPolygon
                    points={points}
                    fill="none"
                    stroke={borderColor}
                    animatedProps={animatedProps}
                />
            </Svg>
        </View>
    );
};
