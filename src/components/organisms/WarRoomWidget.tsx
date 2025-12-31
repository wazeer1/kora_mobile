import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import styled from 'styled-components/native';

export type WarRoomRole = 'host' | 'captain' | 'member' | 'solo' | 'roundtable' | 'spectator' | 'draft' | 'lobby' | 'scheduled' | 'live_urgent' | 'none';

interface WarRoomWidgetProps {
    status: WarRoomRole;
    onPress: () => void;
}

const Container = styled(Animated.View)`
  margin: 16px;
  margin-bottom: 8px;
  border-radius: 12px;
  overflow: hidden;
  elevation: 5;
  shadow-color: black;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
`;

const Content = styled(LinearGradient)`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TextBlock = styled.View`
  flex: 1;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: rgba(255,255,255,0.2);
  padding: 8px 16px;
  border-radius: 20px;
  margin-left: 12px;
`;

export const WarRoomWidget = ({ status, onPress }: WarRoomWidgetProps) => {
    const opacity = useSharedValue(1);

    useEffect(() => {
        if (['live_urgent', 'lobby', 'captain'].includes(status || '')) {
            opacity.value = withRepeat(
                withSequence(
                    withTiming(0.9, { duration: 1500 }),
                    withTiming(1, { duration: 1500 })
                ),
                -1,
                true
            );
        } else {
            opacity.value = 1;
        }
    }, [status]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    if (!status || status === 'none') return null;

    const getConfig = () => {
        switch (status) {
            // Original Cases
            case 'draft': return {
                colors: ['#B8860B', '#DAA520'] as const,
                icon: 'trophy.fill',
                title: 'Draft Pick Pending',
                desc: 'Review Captain Offer',
                btn: 'Review'
            };
            case 'lobby': return {
                colors: ['#2F4F4F', '#4ECDC4'] as const,
                icon: 'clock.arrow.circlepath',
                title: 'Lobby Active',
                desc: 'Waiting for deployment...',
                btn: 'Return'
            };
            case 'scheduled': return {
                colors: ['#1F2937', '#374151'] as const,
                icon: 'calendar',
                title: 'Upcoming Battle',
                desc: 'Starts in 2h 15m',
                btn: 'View'
            };
            case 'live_urgent': return {
                colors: ['#8B0000', '#FF0000'] as const,
                icon: 'flame.fill',
                title: 'YOU ARE ON STAGE!',
                desc: 'GO NOW.',
                btn: 'ENTER'
            };

            // New Role Cases
            case 'host': return {
                colors: ['#4B0082', '#9400D3'] as const, // Deep Purple
                icon: 'eye.fill',
                title: 'Hosting: AI vs Humanity',
                desc: 'Status: Round 2/3 • Systems Nominal',
                btn: 'Watchtower'
            };
            case 'captain': return {
                colors: ['#FFD700', '#FFA500'] as const, // Solid Gold
                icon: 'crown.fill',
                title: 'Your Turn: Team Strategy',
                desc: '3 Members waiting in Queue',
                btn: 'Cockpit'
            };
            case 'member': return {
                colors: ['#008080', '#00CED1'] as const, // Cyan/Teal
                icon: 'shield.fill',
                title: 'Active Match: Team A',
                desc: 'Captain is Speaking... Standby',
                btn: 'Bench'
            };
            case 'solo': return {
                colors: ['#800000', '#FF4500'] as const, // Red/Orange Aggressive
                icon: 'cross.vial', // Sword approximation or check icon library
                title: 'Duel vs @Opponent',
                desc: 'Microphone Active',
                btn: 'Podium'
            };
            case 'roundtable': return {
                colors: ['#008080', '#20B2AA'] as const, // Teal Glass
                icon: 'mic.fill',
                title: 'Panel: Future of Crypto',
                desc: 'Open Floor Mode',
                btn: 'Join Table'
            };
            case 'spectator': return {
                colors: ['#1A1A1A', '#333333'] as const, // Glass/Dark (simulated)
                icon: 'headphones',
                title: 'Listening: Tax Reform',
                desc: 'User A is winning (60%)',
                btn: 'Expand'
            };
            default: return null;
        }
    };

    const config = getConfig();
    if (!config) return null;

    // Fix TS Colors Issue
    const gradientColors = config.colors as unknown as string[];

    return (
        <Container style={animatedStyle}>
            <TouchableOpacity onPress={onPress}>
                <Content colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <View style={{ marginRight: 12 }}>
                        {/* @ts-ignore */}
                        <IconSymbol name={config.icon} size={24} color="white" />
                    </View>
                    <TextBlock>
                        <ThemedText style={{ fontWeight: 'bold', fontSize: 14, color: 'white' }}>{config.title}</ThemedText>
                        <ThemedText style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{config.desc}</ThemedText>
                    </TextBlock>
                    <ActionButton>
                        <ThemedText style={{ fontWeight: 'bold', fontSize: 12, color: 'white' }}>{config.btn}</ThemedText>
                    </ActionButton>
                </Content>
            </TouchableOpacity>
        </Container>
    );
};
