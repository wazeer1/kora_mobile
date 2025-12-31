import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/src/hooks';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import styled from 'styled-components/native';

interface AcceptDuelModalProps {
    visible: boolean;
    challenger: any;
    onClose: () => void;
    onConfirm: () => void;
}

const Avatar = styled(Image)`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  border-width: 4px;
  border-color: #D4AF37;
  align-self: center;
  margin-bottom: 16px;
`;

const RulesContainer = styled.View`
  background-color: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 16px;
  margin-vertical: 24px;
`;

import { SlideToAccept } from '@/src/components/molecules/SlideToAccept';

const SplitContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Contender = styled.View`
  align-items: center;
  flex: 1;
`;

const VsText = styled(ThemedText)`
  font-size: 24px;
  font-weight: 900;
  color: #D4AF37;
  font-style: italic;
`;

const StatTable = styled.View`
  background-color: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
`;

const StatRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StatLabel = styled(ThemedText)`
  color: #B0B3B8;
  font-size: 12px;
  flex: 1;
  text-align: center;
`;

const StatVal = styled(ThemedText)`
  color: white;
  font-weight: bold;
  flex: 1;
  text-align: center;
`;

const RuleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const RuleLabel = styled(ThemedText)`
  color: #B0B3B8;
`;

const RuleValue = styled(ThemedText)`
  font-weight: bold;
  color: white;
`;

export const AcceptDuelModal: React.FC<AcceptDuelModalProps> = ({ visible, challenger, onClose, onConfirm }) => {
    console.log('RENDER: AcceptDuelModal visible:', visible);
    const theme = useTheme();
    const { height } = useWindowDimensions();
    const translateY = useSharedValue(height);

    useEffect(() => {
        if (visible && challenger) {
            translateY.value = withTiming(0, { duration: 300 });
        } else {
            translateY.value = withTiming(height, { duration: 300 });
        }
    }, [visible, challenger, height]);

    const handleClose = () => {
        translateY.value = withTiming(height, { duration: 300 }, (finished) => {
            if (finished) runOnJS(onClose)();
        });
    };

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }]
    }));

    if (!visible || !challenger) return null;

    return (
        <Modal transparent visible={visible} onRequestClose={handleClose}>
            <Pressable
                style={styles.overlay}
                onPress={handleClose}
                onTouchStart={() => console.log('TOUCH_DEBUG: AcceptDuelModal Overlay')}
            >
                <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            </Pressable>

            <Animated.View style={[styles.sheet, sheetStyle, { backgroundColor: '#0A192F' }]}>
                <View style={styles.indicator} />
                <View style={{ padding: 24, paddingBottom: 40 }}>
                    <ThemedText type="title" style={{ textAlign: 'center', marginBottom: 24 }}>The Weigh-In</ThemedText>

                    <SplitContainer>
                        <Contender>
                            <Avatar source={{ uri: challenger.avatar }} />
                            <ThemedText style={{ fontWeight: 'bold' }}>{challenger.name}</ThemedText>
                        </Contender>
                        <VsText>VS</VsText>
                        <Contender>
                            <Avatar source={{ uri: 'https://i.pravatar.cc/300?u=me' }} style={{ borderColor: '#4ECDC4' }} />
                            <ThemedText style={{ fontWeight: 'bold' }}>You</ThemedText>
                        </Contender>
                    </SplitContainer>

                    <StatTable>
                        <StatRow>
                            <StatVal>{challenger.rating}</StatVal>
                            <StatLabel>ELO</StatLabel>
                            <StatVal>1200</StatVal>
                        </StatRow>
                        <StatRow>
                            <StatVal>60%</StatVal>
                            <StatLabel>WIN RATE</StatLabel>
                            <StatVal>55%</StatVal>
                        </StatRow>
                        <StatRow>
                            <StatVal>High</StatVal>
                            <StatLabel>AGGRESSION</StatLabel>
                            <StatVal>Med</StatVal>
                        </StatRow>
                    </StatTable>

                    <ThemedText style={{ textAlign: 'center', marginBottom: 24, color: '#D4AF37' }}>
                        Stakes: 20 Reputation Points
                    </ThemedText>

                    <SlideToAccept onComplete={onConfirm} />
                </View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(212, 175, 55, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 20,
    },
    indicator: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
    }
});
