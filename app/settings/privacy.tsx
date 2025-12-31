import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Switch, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #020C1B; 
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #0A192F;
`;

const HeaderTitle = styled(ThemedText)`
  font-size: 18px;
  font-weight: bold;
  color: white;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;

const Description = styled(ThemedText)`
  font-size: 14px;
  color: #B0B3B8;
  margin-bottom: 32px;
  line-height: 20px;
`;

const Card = styled.View`
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: rgba(255,255,255,0.05);
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 8px;
`;

const Label = styled(ThemedText)`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const SubLabel = styled(ThemedText)`
  color: #666;
  font-size: 12px;
  margin-top: 4px;
  max-width: 250px;
`;

export default function PrivacyScreen() {
    const router = useRouter();

    // States
    const [ghostMode, setGhostMode] = useState(false);
    const [publicElo, setPublicElo] = useState(true);
    const [allowChallenges, setAllowChallenges] = useState(true);

    return (
        <Container>
            <Header>
                <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconSymbol name="chevron.left" size={20} color="#D4AF37" />
                    <ThemedText style={{ color: '#D4AF37', marginLeft: 4 }}>Back</ThemedText>
                </TouchableOpacity>
                <HeaderTitle>CLOAKING</HeaderTitle>
                <View style={{ width: 40 }} />
            </Header>

            <Content>
                <Description>
                    Control your visibility in the Arena. Ghost Mode hides your online status but prevents you from seeing others.
                </Description>

                <Card>
                    <Row>
                        <View>
                            <Label>Ghost Mode</Label>
                            <SubLabel>{ghostMode ? "You are invisible." : "Online status visible."}</SubLabel>
                        </View>
                        <Switch
                            value={ghostMode}
                            onValueChange={setGhostMode}
                            trackColor={{ false: "#767577", true: "#D4AF37" }}
                        />
                    </Row>
                </Card>

                <Card>
                    <Row>
                        <View>
                            <Label>Public Elo</Label>
                            <SubLabel>Show your rating to non-friends.</SubLabel>
                        </View>
                        <Switch
                            value={publicElo}
                            onValueChange={setPublicElo}
                            trackColor={{ false: "#767577", true: "#D4AF37" }}
                        />
                    </Row>
                </Card>

                <Card>
                    <Row>
                        <View>
                            <Label>Allow Challenges</Label>
                            <SubLabel>Receive 1v1 Gauntlet invites.</SubLabel>
                        </View>
                        <Switch
                            value={allowChallenges}
                            onValueChange={setAllowChallenges}
                            trackColor={{ false: "#767577", true: "#D4AF37" }}
                        />
                    </Row>
                </Card>

            </Content>
        </Container>
    );
}
