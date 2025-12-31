import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import styled from 'styled-components/native';

const { width, height } = Dimensions.get('window');
const STAGE_HEIGHT = height * 0.55;

interface DebateStageProps {
    hostAvatar?: string;
    teamA: {
        leader: { name: string; avatar: string; id: string };
        members: { name: string; avatar: string; id: string }[];
    };
    teamB: {
        leader: { name: string; avatar: string; id: string };
        members: { name: string; avatar: string; id: string }[];
    };
    isSpeaking: string; // userId
    onAvatarPress: (id: string, name: string, team: 'A' | 'B' | 'Host') => void;
}

// --- STYLED COMPONENTS ---

const Container = styled.View`
  height: ${STAGE_HEIGHT}px;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #020C1B;
`;

const BackgroundLayer = styled.View`
  flex: 1;
  flex-direction: row;
`;

const HalfSide = styled(LinearGradient)`
  flex: 1;
  opacity: 0.15;
`;

const DiagonalSlash = styled.View`
  position: absolute;
  top: -100px;
  bottom: -100px;
  left: 50%;
  width: 2px;
  background-color: rgba(255, 255, 255, 0.1);
  transform: rotate(15deg);
  z-index: 0;
`;

const VSLabel = styled.View`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -20px;
  margin-top: -20px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background-color: #000;
  border-radius: 20px;
  border-width: 1px;
  border-color: #D4AF37;
  z-index: 10;
`;

const HostContainer = styled.View`
  position: absolute;
  top: 60px;
  align-self: center;
  align-items: center;
  z-index: 20;
`;

const TeamZone = styled.View<{ side: 'left' | 'right' }>`
  position: absolute;
  top: 120px;
  bottom: 0;
  ${props => props.side === 'left' ? 'left: 0; padding-left: 10px;' : 'right: 0; padding-right: 10px;'}
  width: 48%;
  align-items: center;
`;

const AvatarCircle = styled.Image<{ size: number; isActive: boolean; color: string }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: ${props => props.size / 2}px;
  border-width: ${props => props.isActive ? 3 : 1}px;
  border-color: ${props => props.isActive ? props.color : 'rgba(255,255,255,0.3)'};
`;

const CrownBadge = styled.View`
  position: absolute;
  top: -10px;
  right: -5px;
  background-color: #FFD700;
  border-radius: 10px;
  padding: 2px 4px;
`;

const MemberGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const HandRaiseIndicator = styled(Animated.View)`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #007AFF;
  border-radius: 10px;
  padding: 2px 4px;
`;

const MicStatus = styled.View<{ active: boolean }>`
  position: absolute;
  bottom: -5px;
  align-self: center;
  background-color: ${props => props.active ? '#4CD964' : '#FF3B30'};
  border-radius: 8px;
  padding: 2px 6px;
  flex-direction: row;
  align-items: center;
  gap: 2px;
`;

// --- COMPONENT ---

export const DebateStage = ({ hostAvatar, teamA, teamB, isSpeaking, onAvatarPress }: DebateStageProps) => {

    const renderLeader = (leader: any, color: string, team: 'A' | 'B') => (
        <TouchableOpacity onPress={() => onAvatarPress(leader.id, leader.name, team)} style={{ alignItems: 'center', marginBottom: 10 }}>
            <View>
                <AvatarCircle
                    source={{ uri: leader.avatar }}
                    size={80}
                    isActive={isSpeaking === leader.id}
                    color={color}
                />
                <CrownBadge>
                    <IconSymbol name="crown.fill" size={12} color="#000" />
                </CrownBadge>
                {isSpeaking === leader.id && (
                    <MicStatus active>
                        <IconSymbol name="mic.fill" size={10} color="#fff" />
                    </MicStatus>
                )}
            </View>
            <ThemedText style={{ fontSize: 12, fontWeight: 'bold', marginTop: 4 }}>{leader.name}</ThemedText>
        </TouchableOpacity>
    );

    const renderMember = (member: any, color: string, team: 'A' | 'B') => (
        <TouchableOpacity key={member.id} onPress={() => onAvatarPress(member.id, member.name, team)} style={{ alignItems: 'center' }}>
            <View>
                <AvatarCircle
                    source={{ uri: member.avatar }}
                    size={50}
                    isActive={isSpeaking === member.id}
                    color={color}
                />
                {/* Mock Hand Raise for demo if id ends in 3 */}
                {member.id.endsWith('3') && (
                    <HandRaiseIndicator entering={FadeIn} exiting={FadeOut}>
                        <IconSymbol name="hand.raised.fill" size={10} color="#fff" />
                    </HandRaiseIndicator>
                )}
            </View>
            <ThemedText style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{member.name}</ThemedText>
        </TouchableOpacity>
    );

    return (
        <Container>
            {/* Background Split */}
            <BackgroundLayer>
                <HalfSide colors={['rgba(0,10,30,1)', 'rgba(0, 50, 255, 0.2)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                <HalfSide colors={['rgba(0,10,30,1)', 'rgba(255, 0, 50, 0.2)']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} />
            </BackgroundLayer>

            <DiagonalSlash />

            <VSLabel>
                <ThemedText style={{ color: '#D4AF37', fontWeight: '900', fontSize: 12 }}>VS</ThemedText>
            </VSLabel>

            {/* Host */}
            <HostContainer>
                <TouchableOpacity onPress={() => onAvatarPress('host', 'Moderator', 'Host')}>
                    <View style={{ alignItems: 'center' }}>
                        <AvatarCircle
                            source={{ uri: hostAvatar || 'https://i.pravatar.cc/300?u=host' }}
                            size={50}
                            isActive={isSpeaking === 'host'}
                            color="#D4AF37"
                        />
                        <View style={{ backgroundColor: '#D4AF37', paddingHorizontal: 6, borderRadius: 4, marginTop: -8 }}>
                            <ThemedText style={{ color: '#000', fontSize: 8, fontWeight: 'bold' }}>HOST</ThemedText>
                        </View>
                    </View>
                </TouchableOpacity>
            </HostContainer>

            {/* Team A (Blue - Left) */}
            <TeamZone side="left">
                {renderLeader(teamA.leader, '#00FFFF', 'A')}
                <MemberGrid>
                    {teamA.members.map(m => renderMember(m, '#00FFFF', 'A'))}
                </MemberGrid>
            </TeamZone>

            {/* Team B (Red - Right) */}
            <TeamZone side="right">
                {renderLeader(teamB.leader, '#FF0055', 'B')}
                <MemberGrid>
                    {teamB.members.map(m => renderMember(m, '#FF0055', 'B'))}
                </MemberGrid>
            </TeamZone>

        </Container>
    );
};
