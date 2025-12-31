import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const Container = styled.View`
  width: 100%;
  height: 60px;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

const Track = styled.View`
  width: 100%;
  height: 8px;
  background-color: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
  flex-direction: row;
`;

const SideBar = styled(Animated.View)`
  height: 100%;
`;

const Knob = styled(Animated.View)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #D4AF37;
  position: absolute;
  justify-content: center;
  align-items: center;
  shadow-color: black;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  elevation: 5;
  border-width: 2px;
  border-color: white;
  z-index: 10;
`;

export const SentimentSlider = () => {
    const [width, setWidth] = useState(0);
    const offset = useSharedValue(0); // -1 (Left) to 1 (Right)

    const pan = Gesture.Pan()
        .onUpdate((e) => {
            const val = e.translationX / (width / 2);
            // Clamp between -1 and 1
            offset.value = Math.max(-1, Math.min(1, val));
        })
        .onEnd(() => {
            offset.value = withSpring(0); // Snap back to center after vote
        });

    const knobStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: offset.value * (width / 2 - 20) }]
    }));

    const leftStyle = useAnimatedStyle(() => ({
        flex: 1 + offset.value,
        backgroundColor: '#4169E1' // Royal Blue (Side A)
    }));

    const rightStyle = useAnimatedStyle(() => ({
        flex: 1 - offset.value,
        backgroundColor: '#DC143C' // Crimson (Side B)
    }));

    return (
        <GestureHandlerRootView style={{ width: '100%' }}>
            <Container onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
                <Track>
                    <SideBar style={leftStyle} />
                    <SideBar style={rightStyle} />
                </Track>
                <GestureDetector gesture={pan}>
                    <Knob style={knobStyle}>
                        <IconSymbol name="flame.fill" size={20} color="white" />
                    </Knob>
                </GestureDetector>

                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 12 }}>
                    <ThemedText style={{ fontSize: 10, color: '#4169E1', fontWeight: 'bold' }}>VOTE SIDE A</ThemedText>
                    <ThemedText style={{ fontSize: 10, color: '#DC143C', fontWeight: 'bold' }}>VOTE SIDE B</ThemedText>
                </View>
            </Container>
        </GestureHandlerRootView>
    );
};
