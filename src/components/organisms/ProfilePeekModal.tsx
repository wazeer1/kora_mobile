import { ThemedText } from '@/components/themed-text';
import { Button } from '@/src/components/atoms/Button';
import { useTheme } from '@/src/hooks';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import styled from 'styled-components/native';

interface User {
    name: string;
    avatar: string;
    rank: string;
    rating: number;
    winRate: number;
    deltas: number;
    bio: string;
}

interface ProfilePeekModalProps {
    visible: boolean;
    user: User | null;
    onClose: () => void;
}

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

const Avatar = styled(Image)`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border-width: 3px;
  border-color: #D4AF37;
  margin-right: 16px;
`;

const NameInfo = styled.View`
  flex: 1;
`;

const StatsRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 24px;
  padding: 16px;
  background-color: rgba(255,255,255,0.05);
  border-radius: 12px;
`;

const StatItem = styled.View`
  align-items: center;
`;

const StatValue = styled(ThemedText)`
  font-size: 18px;
  font-weight: bold;
  color: #D4AF37;
`;

const StatLabel = styled(ThemedText)`
  font-size: 12px;
  opacity: 0.6;
`;

const ActionRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

export const ProfilePeekModal: React.FC<ProfilePeekModalProps> = ({ visible, user, onClose }) => {
    console.log('RENDER: ProfilePeekModal visible:', visible);
    const theme = useTheme();
    const { height } = useWindowDimensions();
    const translateY = useSharedValue(height);

    useEffect(() => {
        if (visible && user) {
            translateY.value = withTiming(0, { duration: 300 });
        } else {
            translateY.value = withTiming(height, { duration: 300 });
        }
    }, [visible, user, height]);

    const handleClose = () => {
        translateY.value = withTiming(height, { duration: 300 }, (finished) => {
            if (finished) runOnJS(onClose)();
        });
    };

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }]
    }));

    if (!visible || !user) return null;

    return (
        <Modal transparent visible={visible} onRequestClose={handleClose}>
            <Pressable
                style={styles.overlay}
                onPress={handleClose}
                onTouchStart={() => console.log('TOUCH_DEBUG: ProfilePeekModal Overlay')}
            >
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            </Pressable>

            <Animated.View style={[styles.sheet, sheetStyle, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.indicator} />
                <View style={{ padding: 24 }}>
                    <Header>
                        <Avatar source={{ uri: user.avatar }} />
                        <NameInfo>
                            <ThemedText type="subtitle" style={{ fontSize: 24 }}>{user.name}</ThemedText>
                            <ThemedText style={{ color: '#D4AF37', fontWeight: 'bold' }}>{user.rank}</ThemedText>
                        </NameInfo>
                    </Header>

                    <ThemedText style={{ marginBottom: 24, opacity: 0.8 }}>{user.bio}</ThemedText>

                    <StatsRow>
                        <StatItem>
                            <StatValue>{user.rating}</StatValue>
                            <StatLabel>Elo</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatValue>{user.winRate}%</StatValue>
                            <StatLabel>Win Rate</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatValue>Δ {user.deltas}</StatValue>
                            <StatLabel>Deltas</StatLabel>
                        </StatItem>
                    </StatsRow>

                    <ActionRow>
                        <Button
                            label="Follow"
                            variant="outline"
                            onPress={() => { }}
                            style={{ flex: 1 }}
                        />
                        <Button
                            label="Challenge"
                            onPress={() => { }}
                            style={{ flex: 1, backgroundColor: '#D4AF37' }}
                            labelStyle={{ color: '#0A192F' }}
                        />
                    </ActionRow>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
        paddingBottom: 40,
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
