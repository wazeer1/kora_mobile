import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import styled from 'styled-components/native';

interface TimelineTicketProps {
    time: string;
    topic: string;
    role: 'captain' | 'host' | 'member' | 'solo' | 'spectator';
    isUrgent?: boolean;
    onPress: () => void;
}

const Ticket = styled.TouchableOpacity`
  width: 240px;
  height: 60px;
  background-color: rgba(255,255,255,0.05);
  border-radius: 12px;
  border-width: 1px;
  border-color: rgba(255,255,255,0.1);
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  margin-right: 12px;
`;

const TimeBox = styled.View<{ isUrgent: boolean }>`
  align-items: center;
  justify-content: center;
  padding-right: 12px;
  border-right-width: 1px;
  border-right-color: rgba(255,255,255,0.1);
`;

const InfoBox = styled.View`
  flex: 1;
  padding-left: 12px;
  justify-content: center;
`;

const RoleIcon = styled.View`
  position: absolute;
  top: 4px;
  right: 4px;
`;

export const TimelineTicket = ({ time, topic, role, isUrgent = false, onPress }: TimelineTicketProps) => {

    const getRoleIcon = () => {
        switch (role) {
            case 'captain': return 'crown.fill';
            case 'host': return 'eye.fill';
            case 'member': return 'shield.fill';
            case 'solo': return 'cross.vial';
            default: return 'headphones';
        }
    };

    const getRoleColor = () => {
        switch (role) {
            case 'captain': return '#FFD700';
            case 'host': return '#9400D3';
            case 'solo': return '#FF4500';
            default: return '#B0B3B8';
        }
    };

    return (
        <Ticket onPress={onPress}>
            <TimeBox isUrgent={isUrgent}>
                <ThemedText style={{ fontSize: 10, color: isUrgent ? '#FF6B6B' : '#B0B3B8', fontWeight: 'bold' }}>
                    {time.split(' ')[0]}
                </ThemedText>
                <ThemedText style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}>
                    {time.split(' ')[1]}
                </ThemedText>
            </TimeBox>

            <InfoBox>
                <ThemedText numberOfLines={1} style={{ fontSize: 12, fontWeight: 'bold', color: 'white' }}>
                    {topic}
                </ThemedText>
                <ThemedText style={{ fontSize: 10, color: getRoleColor() }}>
                    {role.toUpperCase()}
                </ThemedText>
            </InfoBox>

            <RoleIcon>
                {/* @ts-ignore */}
                <IconSymbol name={getRoleIcon()} size={12} color={getRoleColor()} />
            </RoleIcon>
        </Ticket>
    );
};
