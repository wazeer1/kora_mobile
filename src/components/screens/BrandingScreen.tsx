import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import styled from 'styled-components/native';

const { width, height } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  background-color: #020C1B;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const LOGO_SIZE = 120;
const STROKE_LENGTH = 1000; // Approx length of hex path

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface BrandingScreenProps {
    onFinish: () => void;
}

export const BrandingScreen = ({ onFinish }: BrandingScreenProps) => {
    // Animation Values
    const strokeProgress = useSharedValue(0);
    const fillOpacity = useSharedValue(0);
    const scale = useSharedValue(1);
    const portalScale = useSharedValue(1);

    useEffect(() => {
        // Sequence: Trace -> Pulse -> Portal
        strokeProgress.value = withTiming(1, { duration: 1500 }, () => {
            // Fill & Pulse
            fillOpacity.value = withTiming(1, { duration: 500 });
            scale.value = withSequence(
                withSpring(1.2),
                withSpring(1.0)
            );

            // Portal Expand after delay
            portalScale.value = withDelay(500, withTiming(50, { duration: 800 }, () => {
                runOnJS(onFinish)();
            }));
        });
    }, []);

    // Animated Props for SVG Path
    const pathProps = useAnimatedProps(() => {
        const strokeDashoffset = interpolate(
            strokeProgress.value,
            [0, 1],
            [STROKE_LENGTH, 0]
        );
        return {
            strokeDashoffset,
        };
    });

    const containerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: portalScale.value }],
    }));

    const logoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: fillOpacity.value,
    }));

    // Hexagon Path Data
    const d = "M60 5 L110 32 L110 88 L60 115 L10 88 L10 32 Z"; // Simplified Hex

    return (
        <Container>
            <Animated.View style={containerStyle}>
                <Svg width={LOGO_SIZE} height={LOGO_SIZE} viewBox="0 0 120 120">
                    {/* Trace Layer */}
                    <AnimatedPath
                        d={d}
                        stroke="#D4AF37"
                        strokeWidth="2"
                        strokeDasharray={STROKE_LENGTH}
                        fill="transparent"
                        animatedProps={pathProps}
                    />
                    {/* Fill Layer (Fades in) */}
                    <AnimatedPath
                        d={d}
                        fill="#D4AF37" // Solid Gold for Portal effect (becomes background)
                        opacity={0}
                        style={logoStyle as any}
                    />
                </Svg>
            </Animated.View>
        </Container>
    );
};
