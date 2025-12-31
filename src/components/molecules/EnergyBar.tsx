import { ThemedText } from '@/components/themed-text';
import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const CellsContainer = styled.View`
  flex-direction: row;
  gap: 2px;
`;

const Cell = styled.View<{ active: boolean; color: string }>`
  width: 6px;
  height: 16px;
  background-color: ${props => props.active ? props.color : 'rgba(255,255,255,0.1)'};
  border-radius: 2px;
  border-width: 1px;
  border-color: ${props => props.active ? 'transparent' : 'rgba(255,255,255,0.05)'};
  shadow-color: ${props => props.color};
  shadow-offset: 0px 0px;
  shadow-opacity: ${props => props.active ? 0.8 : 0};
  shadow-radius: 4px;
`;

interface EnergyBarProps {
    value: number; // 0 to 100
    color: string;
    label?: string;
    alignRight?: boolean;
}

export const EnergyBar = ({ value, color, label, alignRight = false }: EnergyBarProps) => {
    // 10 Segments
    const segments = Array.from({ length: 15 }, (_, i) => i);
    const activeIndex = Math.floor((value / 100) * 15);

    return (
        <Container style={{ flexDirection: alignRight ? 'row-reverse' : 'row' }}>
            {label && (
                <ThemedText style={{ fontSize: 10, fontWeight: 'bold', color: color, width: 30, textAlign: alignRight ? 'right' : 'left' }}>
                    {value}%
                </ThemedText>
            )}
            <CellsContainer style={{ flexDirection: alignRight ? 'row-reverse' : 'row' }}>
                {segments.map(i => (
                    <Cell
                        key={i}
                        active={i < activeIndex}
                        color={color}
                    />
                ))}
            </CellsContainer>
        </Container>
    );
};
