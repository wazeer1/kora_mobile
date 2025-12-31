import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/src/components/atoms/Button';
import { Image } from 'expo-image';
import React from 'react';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';
import styled from 'styled-components/native';

interface RecruitmentModalProps {
    visible: boolean;
    onClose: () => void;
    onAccept: () => void;
    onDecline: () => void;
}

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: flex-end;
`;

const Container = styled.View`
  background-color: #0A192F;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px;
  min-height: 400px;
  border-top-width: 1px;
  border-top-color: #D4AF37;
`;

const Header = styled.View`
  align-items: center;
  margin-bottom: 24px;
`;

const HostAvatar = styled(Image)`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-bottom: 12px;
  border-width: 2px;
  border-color: #D4AF37;
`;

const RoleCard = styled.View`
  background-color: rgba(212, 175, 55, 0.05);
  padding: 16px;
  border-radius: 12px;
  border-width: 1px;
  border-color: rgba(212, 175, 55, 0.3);
  margin-bottom: 24px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const RecruitmentModal = ({ visible, onClose, onAccept, onDecline }: RecruitmentModalProps) => {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableWithoutFeedback onPress={onClose}>
                <Overlay>
                    <TouchableWithoutFeedback>
                        <Container>
                            <View style={{ alignItems: 'flex-end' }}>
                                <IconSymbol name="xmark" size={24} color="#B0B3B8" onPress={onClose} />
                            </View>

                            <Header>
                                <HostAvatar source={{ uri: 'https://i.pravatar.cc/150?u=wazeer' }} />
                                <ThemedText type="subtitle" style={{ color: 'white' }}>Draft Invite</ThemedText>
                                <ThemedText style={{ color: '#B0B3B8', textAlign: 'center', marginTop: 8 }}>
                                    @Wazeer wants you to lead Side A against @LogicMaster.
                                </ThemedText>
                            </Header>

                            <RoleCard>
                                <Row>
                                    <ThemedText style={{ color: '#B0B3B8' }}>Format:</ThemedText>
                                    <ThemedText style={{ fontWeight: 'bold', color: 'white' }}>3v3 Squad</ThemedText>
                                </Row>
                                <Row>
                                    <ThemedText style={{ color: '#B0B3B8' }}>Role:</ThemedText>
                                    <ThemedText style={{ fontWeight: 'bold', color: '#D4AF37' }}>Team Captain 👑</ThemedText>
                                </Row>
                                <Row>
                                    <ThemedText style={{ color: '#B0B3B8' }}>Opponent Elo:</ThemedText>
                                    <ThemedText style={{ fontWeight: 'bold', color: 'white' }}>1800 (Avg)</ThemedText>
                                </Row>
                                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 12 }} />
                                <ThemedText style={{ fontSize: 12, color: '#E0E0E0', lineHeight: 18 }}>
                                    "I need a strong opener for this topic. You're the best I know at economic theory."
                                </ThemedText>
                            </RoleCard>

                            <View style={{ gap: 12 }}>
                                <Button
                                    label="ACCEPT & RECRUIT YOUR TEAM"
                                    fullWidth
                                    style={{ backgroundColor: '#D4AF37' }}
                                    labelStyle={{ color: '#0A192F', fontWeight: 'bold' }}
                                    onPress={onAccept}
                                />
                                <Button
                                    label="DECLINE OFFER"
                                    fullWidth
                                    variant="outline"
                                    onPress={onDecline}
                                />
                            </View>
                        </Container>
                    </TouchableWithoutFeedback>
                </Overlay>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
