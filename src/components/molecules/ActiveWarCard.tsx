import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = 180;

export type WarCardRole = 'host' | 'captain' | 'member' | 'solo' | 'roundtable' | 'spectator';

interface ActiveWarCardProps {
    role: WarCardRole;
    title: string;
    topic: string;
    status: string;
    onPress: () => void;
    onClose?: () => void; // New: For Spectator dismissal
    onSubtitlePress?: () => void; // New: For Queue/Context actions
}

const Container = styled(Animated.View)`
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
  border-radius: 20px;
  overflow: hidden;
  margin-right: 16px;
  elevation: 8;
  shadow-color: black;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.4;
  shadow-radius: 12px;
`;

const Content = styled(LinearGradient)`
  flex: 1;
  padding: 20px;
  justify-content: space-between;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Badge = styled.View`
  background-color: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 12px;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 4px;
  background-color: rgba(0,0,0,0.2);
  border-radius: 12px;
`;

const Body = styled.View`
  margin-top: 10px;
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: white;
  padding: 10px 24px;
  border-radius: 24px;
  elevation: 4;
`;

export const ActiveWarCard = ({ role, title, topic, status, onPress, onClose, onSubtitlePress }: ActiveWarCardProps) => {
    // Pulse animation for critical roles
    const scale = useSharedValue(1);

    useEffect(() => {
        if (role === 'captain' || role === 'solo') {
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.02, { duration: 1500 }),
                    withTiming(1, { duration: 1500 })
                ),
                -1,
                true
            );
        }
    }, [role]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const getConfig = () => {
        switch (role) {
            case 'captain': return {
                colors: ['#FFD700', '#DAA520', '#B8860B'] as const, // GOLD
                icon: 'crown.fill',
                btnText: 'ENTER COCKPIT',
                textColor: '#0A192F' // Dark text on gold
            };
            case 'solo': return {
                colors: ['#FF4500', '#B22222', '#800000'] as const, // RED AGGRESSIVE
                icon: 'cross.vial', // fallback for swords
                btnText: 'TAKE PODIUM',
                textColor: 'white'
            };
            case 'member': return {
                colors: ['#00BFFF', '#1E90FF', '#00008B'] as const, // BLUE/NAVY
                icon: 'shield.fill',
                btnText: 'GO TO BENCH',
                textColor: 'white'
            };
            case 'roundtable': return {
                colors: ['#20B2AA', '#008080', '#2F4F4F'] as const, // TEAL/GLASS
                icon: 'mic.fill',
                btnText: 'JOIN TABLE',
                textColor: 'white'
            };
            case 'host': return {
                colors: ['#9932CC', '#800080', '#4B0082'] as const, // PURPLE
                icon: 'eye.fill',
                btnText: 'ENTER WATCHTOWER',
                textColor: 'white'
            };
            default: return { // SPECTATOR
                colors: ['#4A4A4A', '#2C2C2C', '#1A1A1A'] as const, // GLASS/GREY
                icon: 'headphones',
                btnText: 'EXPAND VIEW',
                textColor: '#B0B3B8'
            };
        }
    };

    const config = getConfig();
    const colors = config.colors as unknown as string[];

    return (
        <Container style={animatedStyle}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={{ flex: 1 }}>
                <Content colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>

                    <HeaderRow>
                        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                            {/* @ts-ignore */}
                            <IconSymbol name={config.icon} size={20} color={config.textColor === '#0A192F' ? '#0A192F' : 'white'} />
                            <ThemedText style={{ fontSize: 12, fontWeight: 'bold', color: config.textColor, letterSpacing: 1 }}>
                                {title.toUpperCase()}
                            </ThemedText>
                        </View>
                        {role === 'captain' && <Badge><ThemedText style={{ fontSize: 10, fontWeight: 'bold' }}>URGENT</ThemedText></Badge>}
                        {role === 'spectator' && onClose && (
                            <CloseButton onPress={onClose}>
                                <IconSymbol name="xmark" size={12} color="white" />
                            </CloseButton>
                        )}
                    </HeaderRow>

                    <Body>
                        <ThemedText style={{ fontSize: 22, fontWeight: 'bold', color: config.textColor === '#0A192F' ? '#0A192F' : 'white', fontFamily: 'serif' }}>
                            {topic}
                        </ThemedText>
                        <TouchableOpacity onPress={onSubtitlePress} activeOpacity={onSubtitlePress ? 0.7 : 1}>
                            <ThemedText style={{ fontSize: 12, color: config.textColor === '#0A192F' ? 'rgba(10,25,47,0.7)' : 'rgba(255,255,255,0.7)', marginTop: 4, textDecorationLine: onSubtitlePress ? 'underline' : 'none' }}>
                                {status}
                            </ThemedText>
                        </TouchableOpacity>
                    </Body>

                    <Footer>
                        <View style={{ flexDirection: 'row', gap: 4 }}>
                            {/* Mock Avatars */}
                            {[1, 2, 3].map(i => <View key={i} style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.3)', marginLeft: -6 }} />)}
                        </View>
                        <ActionButton onPress={onPress}>
                            <ThemedText style={{ fontSize: 12, fontWeight: 'bold', color: '#0A192F' }}>
                                {config.btnText}
                            </ThemedText>
                        </ActionButton>
                    </Footer>

                </Content>
            </TouchableOpacity>
        </Container>
    );
};
