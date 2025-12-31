import { ThemedText } from '@/components/themed-text';
import { HexAvatar } from '@/src/components/molecules/HexAvatar';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const { width, height } = Dimensions.get('window');
const STAGE_HEIGHT = height * 0.65;
const HEX_SIZE = width * 0.40;
const SMALL_HEX_SIZE = width * 0.25;

type LayoutType = '1v1' | '3v3' | 'roundtable';

interface HexStageProps {
    avatar1: string;
    avatar2: string;
    name1: string;
    name2: string;
    isSpeaking: '1' | '2' | 'none';
    layout?: LayoutType;
    onAvatarPress: (id: string, name: string, team: 'A' | 'B' | 'None') => void;
}

const Container = styled.View`
  height: ${STAGE_HEIGHT}px;
  width: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
`;

// 1v1 & 3v3 Lightning Gap
const LightningGap = styled(Animated.View)`
  position: absolute;
  width: 150%;
  height: 4px;
  background-color: #0A192F;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: #D4AF37;
  transform: rotate(-15deg);
  z-index: 0;
  top: 50%;
  opacity: 0.5;
`;

const TeamContainer = styled(Animated.View) <{ isTop: boolean }>`
  position: absolute;
  ${props => props.isTop ? 'top: 5%; right: 10%;' : 'bottom: 5%; left: 10%;'}
  align-items: center;
`;

const NameTag = styled(LinearGradient)`
  padding: 4px 12px;
  border-radius: 12px;
  margin-top: -12px;
  z-index: 10;
  border-width: 1px;
`;

// 3v3 Member Positions relative to Captain
const MemberPos = styled(View) <{ offset: number }>`
  position: absolute;
  top: 50%;
  ${props => props.offset === 1 ? 'left: -60px;' : 'right: -60px;'}
  margin-top: 40px; 
  z-index: -1;
`;

// Roundtable Grid Container
const GridContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  width: 90%;
`;

export const HexStage = ({ avatar1, avatar2, name1, name2, isSpeaking, layout = '1v1', onAvatarPress }: HexStageProps) => {
    // Animations
    const scale1 = useSharedValue(1);
    const scale2 = useSharedValue(1);
    const opacity1 = useSharedValue(1);
    const opacity2 = useSharedValue(1);

    useEffect(() => {
        if (isSpeaking === '1') {
            scale1.value = withSpring(1.1);
            scale2.value = withSpring(0.9);
            opacity1.value = withTiming(1);
            opacity2.value = withTiming(0.6);
        } else if (isSpeaking === '2') {
            scale1.value = withSpring(0.9);
            scale2.value = withSpring(1.1);
            opacity1.value = withTiming(0.6);
            opacity2.value = withTiming(1);
        } else {
            scale1.value = withSpring(1);
            scale2.value = withSpring(1);
            opacity1.value = withTiming(1);
            opacity2.value = withTiming(1);
        }
    }, [isSpeaking]);

    const style1 = useAnimatedStyle(() => ({ transform: [{ scale: scale1.value }], opacity: opacity1.value }));
    const style2 = useAnimatedStyle(() => ({ transform: [{ scale: scale2.value }], opacity: opacity2.value }));

    // Roundtable Layout
    if (layout === 'roundtable') {
        const PANELISTS = [
            { id: '1', name: 'Alice', avatar: avatar1 },
            { id: '2', name: 'Bob', avatar: avatar2 },
            { id: '3', name: 'Charlie', avatar: 'https://i.pravatar.cc/300?u=5' },
            { id: '4', name: 'Dave', avatar: 'https://i.pravatar.cc/300?u=6' },
            { id: '5', name: 'Eve', avatar: 'https://i.pravatar.cc/300?u=7' },
        ];

        return (
            <Container>
                <GridContainer>
                    {PANELISTS.map((p, i) => (
                        <TouchableOpacity key={p.id} onPress={() => onAvatarPress(p.id, p.name, 'None')}>
                            <View style={{ alignItems: 'center' }}>
                                <HexAvatar
                                    size={width * 0.28}
                                    source={p.avatar}
                                    borderColor={isSpeaking === p.id ? '#00FFFF' : 'rgba(255,255,255,0.2)'}
                                    isActive={isSpeaking === p.id}
                                />
                                <ThemedText style={{ fontSize: 10, marginTop: 4 }}>{p.name}</ThemedText>
                            </View>
                        </TouchableOpacity>
                    ))}
                </GridContainer>
            </Container>
        );
    }

    // 1v1 and 3v3 Layout
    return (
        <Container>
            <LightningGap />

            {/* Team A (Top/Right) */}
            <TeamContainer isTop style={style1}>
                {layout === '3v3' && (
                    <>
                        <MemberPos offset={1}>
                            <HexAvatar size={SMALL_HEX_SIZE} source="https://i.pravatar.cc/300?u=3" borderColor="rgba(0,255,255,0.3)" />
                        </MemberPos>
                        <MemberPos offset={2}>
                            <HexAvatar size={SMALL_HEX_SIZE} source="https://i.pravatar.cc/300?u=4" borderColor="rgba(0,255,255,0.3)" />
                        </MemberPos>
                    </>
                )}
                <TouchableOpacity onPress={() => onAvatarPress('1', name1, 'A')}>
                    <HexAvatar
                        size={HEX_SIZE}
                        source={avatar1}
                        borderColor="#00FFFF" // Cyan
                        isActive={isSpeaking === '1'}
                    />
                </TouchableOpacity>
                <NameTag colors={['rgba(0,0,0,0.8)', 'rgba(0, 255, 255, 0.2)']} style={{ borderColor: 'rgba(0,255,255,0.5)' }}>
                    <ThemedText style={{ color: '#00FFFF', fontWeight: 'bold' }}>{name1}</ThemedText>
                </NameTag>
            </TeamContainer>

            {/* Team B (Bottom/Left) */}
            <TeamContainer isTop={false} style={style2}>
                {layout === '3v3' && (
                    <>
                        <MemberPos offset={1}>
                            <HexAvatar size={SMALL_HEX_SIZE} source="https://i.pravatar.cc/300?u=8" borderColor="rgba(255,0,255,0.3)" />
                        </MemberPos>
                        <MemberPos offset={2}>
                            <HexAvatar size={SMALL_HEX_SIZE} source="https://i.pravatar.cc/300?u=9" borderColor="rgba(255,0,255,0.3)" />
                        </MemberPos>
                    </>
                )}
                <TouchableOpacity onPress={() => onAvatarPress('2', name2, 'B')}>
                    <HexAvatar
                        size={HEX_SIZE}
                        source={avatar2}
                        borderColor="#FF00FF" // Magenta
                        isActive={isSpeaking === '2'}
                    />
                </TouchableOpacity>
                <NameTag colors={['rgba(0,0,0,0.8)', 'rgba(255, 0, 255, 0.2)']} style={{ borderColor: 'rgba(255,0,255,0.5)' }}>
                    <ThemedText style={{ color: '#FF00FF', fontWeight: 'bold' }}>{name2}</ThemedText>
                </NameTag>
            </TeamContainer>
        </Container>
    );
};
