import { ThemedText } from '@/components/themed-text';
import Slider from '@react-native-community/slider';
import React from 'react';
import { Switch, View } from 'react-native';
import styled from 'styled-components/native';

interface PhaseBuilderProps {
    duration: number;
    onDurationChange: (val: number) => void;
    aiEnabled?: boolean;
    onAiToggle?: (res: boolean) => void;
    label: string;
    maxDuration?: number;
    showAiOptions?: boolean;
}

const Container = styled.View`
  margin-bottom: 24px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Label = styled(ThemedText)`
  font-weight: bold;
  color: white;
  font-size: 16px;
`;

const DurationText = styled(ThemedText)`
  color: #D4AF37;
  font-weight: bold;
`;

const ControlRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  background-color: rgba(255,255,255,0.05);
  padding: 12px;
  border-radius: 8px;
`;

export const PhaseBuilder = ({
    duration,
    onDurationChange,
    aiEnabled,
    onAiToggle,
    label,
    maxDuration = 10,
    showAiOptions = false
}: PhaseBuilderProps) => {
    return (
        <Container>
            <HeaderRow>
                <Label>{label}</Label>
                <DurationText>{duration} min</DurationText>
            </HeaderRow>

            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={1}
                maximumValue={maxDuration}
                step={1}
                value={duration}
                onValueChange={onDurationChange}
                minimumTrackTintColor="#D4AF37"
                maximumTrackTintColor="#333"
                thumbTintColor="white"
            />

            {showAiOptions && onAiToggle && (
                <ControlRow>
                    <View>
                        <ThemedText style={{ fontSize: 14 }}>AI Integration</ThemedText>
                        <ThemedText style={{ fontSize: 10, color: '#B0B3B8' }}>Generate content for this phase</ThemedText>
                    </View>
                    <Switch
                        value={aiEnabled}
                        onValueChange={onAiToggle}
                        trackColor={{ false: '#767577', true: '#D4AF37' }}
                    />
                </ControlRow>
            )}
        </Container>
    );
};
