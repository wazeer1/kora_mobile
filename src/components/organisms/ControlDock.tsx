import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BlurView } from 'expo-blur';
import React from 'react';
import styled from 'styled-components/native';
import { WarRoomRole } from './WarRoomWidget';

interface ControlDockProps {
    role: WarRoomRole; // 'host' | 'captain' | 'member' | 'spectator' | 'solo' | 'roundtable'
    onAction: (action: string) => void;
    joinRequestCount?: number; // For Captain/Host
}

const Container = styled(BlurView)`
  position: absolute;
  bottom: 30px;
  left: 20px;
  right: 20px;
  border-radius: 32px;
  padding: 16px;
  border-width: 1px;
  border-color: rgba(255,255,255,0.1);
  overflow: hidden;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

// Generic Button Styles
const DockBtn = styled.TouchableOpacity<{ color?: string }>`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${props => props.color || 'rgba(255,255,255,0.1)'};
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: rgba(255,255,255,0.2);
`;

const MainActionBtn = styled.TouchableOpacity<{ color?: string }>`
  flex: 1;
  height: 56px;
  background-color: ${props => props.color || '#D4AF37'};
  border-radius: 28px;
  margin-horizontal: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  shadow-opacity: 0.3;
  shadow-radius: 5px;
  elevation: 5;
`;

const Badge = styled.View`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #FF3B30;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #fff;
`;

export const ControlDock = ({ role, onAction, joinRequestCount = 0 }: ControlDockProps) => {

    // --- GROUP LEADER (Captain) ---
    if (role === 'captain') {
        return (
            <Container intensity={80} tint="dark">
                {/* Left: Team Settings */}
                <DockBtn onPress={() => onAction('team_settings')}>
                    <IconSymbol name="gear" size={24} color="white" />
                </DockBtn>

                {/* Center: Pass Mic */}
                <MainActionBtn color="#D4AF37" onPress={() => onAction('pass_mic')}>
                    <IconSymbol name="mic.fill" size={24} color="#0A192F" />
                    <ThemedText style={{ color: '#0A192F', fontWeight: 'bold', fontSize: 16 }}>PASS MIC</ThemedText>
                </MainActionBtn>

                {/* Right: Join Requests */}
                <DockBtn onPress={() => onAction('join_requests')}>
                    <IconSymbol name="person.3.fill" size={20} color="white" />
                    {joinRequestCount > 0 && (
                        <Badge>
                            <ThemedText style={{ fontSize: 10, fontWeight: 'bold' }}>{joinRequestCount}</ThemedText>
                        </Badge>
                    )}
                </DockBtn>
            </Container>
        );
    }

    // --- SPECTATOR ---
    if (role === 'spectator') {
        return (
            <Container intensity={80} tint="dark">
                {/* Left: Raise Hand (Request to Speak) */}
                <DockBtn onPress={() => onAction('raise_hand')}>
                    <IconSymbol name="hand.raised.fill" size={24} color="#00FFFF" />
                </DockBtn>

                {/* Center: React (Emojis) */}
                <MainActionBtn color="rgba(255,255,255,0.1)" onPress={() => onAction('react')}>
                    <IconSymbol name="flame.fill" size={24} color="#FF9F0A" />
                    <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>REACT</ThemedText>
                </MainActionBtn>

                {/* Right: Leave */}
                <DockBtn color="rgba(255, 59, 48, 0.2)" onPress={() => onAction('leave')}>
                    <IconSymbol name="xmark" size={24} color="#FF3B30" />
                </DockBtn>
            </Container>
        );
    }

    // --- HOST (Admin) ---
    if (role === 'host') {
        return (
            <Container intensity={80} tint="dark">
                <DockBtn onPress={() => onAction('settings')}>
                    <IconSymbol name="gear" size={24} color="white" />
                </DockBtn>

                <MainActionBtn color="#9400D3" onPress={() => onAction('manage_stage')}>
                    <IconSymbol name="slider.horizontal.3" size={24} color="white" />
                    <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>MANAGE STAGE</ThemedText>
                </MainActionBtn>

                <DockBtn color="rgba(255, 0, 0, 0.2)" onPress={() => onAction('end_debates')}>
                    <IconSymbol name="power" size={24} color="#FF3B30" />
                </DockBtn>
            </Container>
        );
    }

    // --- FALLBACK (Member / Solo) ---
    return (
        <Container intensity={80} tint="dark">
            <DockBtn onPress={() => onAction('react')}>
                <IconSymbol name="heart.fill" size={24} color="#FF2D55" />
            </DockBtn>

            <MainActionBtn color={role === 'member' ? '#00FFFF' : '#32D74B'} onPress={() => onAction('mic_toggle')}>
                <IconSymbol name="mic.fill" size={24} color="#000" />
                <ThemedText style={{ color: '#000', fontWeight: 'bold' }}>{role === 'member' ? 'REQUEST MIC' : 'SPEAK'}</ThemedText>
            </MainActionBtn>

            <DockBtn color="rgba(255, 59, 48, 0.2)" onPress={() => onAction('leave')}>
                <IconSymbol name="xmark" size={24} color="red" />
            </DockBtn>
        </Container>
    );
};
