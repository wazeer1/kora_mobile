import React, { useEffect } from 'react';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 20px;
  gap: 2px;
`;

const Bar = styled(Animated.View)`
  width: 3px;
  background-color: #D4AF37;
  border-radius: 1.5px;
`;

export const AudioWaveform = ({ active }: { active: boolean }) => {
    const bars = [1, 2, 3, 4, 5];

    // We create a component for each bar to handle its own animation independently slightly
    return (
        <Container>
            {bars.map((i) => (
                <WaveBar key={i} index={i} active={active} />
            ))}
        </Container>
    );
};

const WaveBar = ({ index, active }: { index: number, active: boolean }) => {
    const height = useSharedValue(4);

    useEffect(() => {
        if (active) {
            // Randomize duration slightly for organic look
            const duration = 300 + Math.random() * 200;
            height.value = withDelay(
                index * 50,
                withRepeat(
                    withSequence(
                        withTiming(12 + Math.random() * 8, { duration }),
                        withTiming(4, { duration })
                    ),
                    -1,
                    true
                )
            );
        } else {
            height.value = withTiming(4);
        }
    }, [active]);

    const style = useAnimatedStyle(() => ({
        height: height.value,
        opacity: active ? 1 : 0.5
    }));

    return <Bar style={style} />;
};
