import { ThemedText } from '@/components/themed-text';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import styled from 'styled-components/native';

interface RockerSwitchProps {
    value: boolean;
    onValueChange: (val: boolean) => void;
    label?: string;
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SwitchTrack = styled.View`
  width: 52px;
  height: 32px;
  background-color: #333;
  borderRadius: 4px;
  padding: 2px;
  flex-direction: row;
  border-width: 1px;
  border-color: #555;
`;

const Thumb = styled(Animated.View)`
  position: absolute;
  width: 24px;
  height: 26px;
  background-color: #D4AF37;
  border-radius: 2px;
  top: 2px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
  elevation: 2;
`;

export const RockerSwitch = ({ value, onValueChange, label }: RockerSwitchProps) => {

    const toggle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        onValueChange(!value);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: withTiming(value ? 22 : 2, { duration: 150 }) }]
    }));

    return (
        <Container>
            {label && <ThemedText style={{ fontSize: 16 }}>{label}</ThemedText>}
            <Pressable onPress={toggle}>
                <SwitchTrack>
                    <View style={{ flex: 1 }} />
                    <View style={{ flex: 1 }} />
                    <Thumb style={animatedStyle} />
                </SwitchTrack>
            </Pressable>
        </Container>
    );
};
