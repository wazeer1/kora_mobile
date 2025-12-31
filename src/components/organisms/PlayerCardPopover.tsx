import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { HexAvatar } from '@/src/components/molecules/HexAvatar';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import styled from 'styled-components/native';

interface PlayerCardPopoverProps {
    visible: boolean;
    onClose: () => void;
    user: { name: string; team: 'A' | 'B'; avatar: string } | null;
}

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
`;

const BlurContainer = styled(BlurView)`
  width: 85%;
  border-radius: 20px;
  overflow: hidden;
  border-width: 1px;
  border-color: rgba(255,255,255,0.1);
`;

const Content = styled.View`
  padding: 24px;
  align-items: center;
  background-color: rgba(10, 25, 47, 0.8);
`;

const RoleBadge = styled.View<{ team: 'A' | 'B' }>`
  margin-top: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  background-color: ${props => props.team === 'A' ? 'rgba(0, 255, 255, 0.1)' : 'rgba(255, 0, 255, 0.1)'};
  border-width: 1px;
  border-color: ${props => props.team === 'A' ? '#00FFFF' : '#FF00FF'};
`;

const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  margin-top: 24px;
`;

const Metric = styled.View`
  width: 48%;
  background-color: rgba(255,255,255,0.05);
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  align-items: center;
`;

const ActionRow = styled.View`
  flex-direction: row;
  gap: 16px;
  margin-top: 24px;
`;

const CircleButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: rgba(255,255,255,0.1);
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: rgba(255,255,255,0.1);
`;

export const PlayerCardPopover = ({ visible, onClose, user }: PlayerCardPopoverProps) => {
    if (!visible || !user) return null;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <Overlay>
                    <TouchableWithoutFeedback>
                        <Animated.View entering={ZoomIn.duration(300)}>
                            <BlurContainer intensity={80} tint="dark">
                                <Content>
                                    <HexAvatar
                                        size={80}
                                        source={user.avatar}
                                        borderColor={user.team === 'A' ? '#00FFFF' : '#FF00FF'}
                                    />
                                    <ThemedText type="subtitle" style={{ marginTop: 16 }}>{user.name}</ThemedText>
                                    <ThemedText style={{ color: '#B0B3B8' }}>@LogicMaster • 1450 💎</ThemedText>

                                    <RoleBadge team={user.team}>
                                        <ThemedText style={{
                                            color: user.team === 'A' ? '#00FFFF' : '#FF00FF',
                                            fontSize: 10, fontWeight: 'bold'
                                        }}>
                                            CAPTAIN SIDE {user.team}
                                        </ThemedText>
                                    </RoleBadge>

                                    <Grid>
                                        <Metric>
                                            <IconSymbol name="stopwatch" size={16} color="#D4AF37" />
                                            <ThemedText style={{ fontSize: 10, color: '#B0B3B8', marginTop: 4 }}>Avg Turn</ThemedText>
                                            <ThemedText style={{ fontWeight: 'bold' }}>45s</ThemedText>
                                        </Metric>
                                        <Metric>
                                            <IconSymbol name="trophy.fill" size={16} color="#D4AF37" />
                                            <ThemedText style={{ fontSize: 10, color: '#B0B3B8', marginTop: 4 }}>Win Rate</ThemedText>
                                            <ThemedText style={{ fontWeight: 'bold' }}>62%</ThemedText>
                                        </Metric>
                                    </Grid>

                                    <ActionRow>
                                        <CircleButton>
                                            <IconSymbol name="speaker.slash.fill" size={20} color="white" />
                                        </CircleButton>
                                        <CircleButton>
                                            <IconSymbol name="person.badge.plus.fill" size={20} color="white" />
                                        </CircleButton>
                                        <CircleButton>
                                            <IconSymbol name="flag.fill" size={20} color="#FF6B6B" />
                                        </CircleButton>
                                    </ActionRow>
                                </Content>
                            </BlurContainer>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </Overlay>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
