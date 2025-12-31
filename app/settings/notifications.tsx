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

const SectionTitle = styled(ThemedText)`
  font-size: 12px;
  color: #D4AF37;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 24px;
  margin-bottom: 12px;
  font-weight: bold;
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
  margin-bottom: 16px;
`;

const Label = styled(ThemedText)`
  color: white;
  font-size: 14px;
`;

export default function NotificationsScreen() {
    const router = useRouter();

    // States
    const [draftInvites, setDraftInvites] = useState(true);
    const [liveNow, setLiveNow] = useState(true);
    const [newFollowers, setNewFollowers] = useState(true);
    const [mentions, setMentions] = useState(true);
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailDigest, setEmailDigest] = useState(false);

    return (
        <Container>
            <Header>
                <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconSymbol name="chevron.left" size={20} color="#D4AF37" />
                    <ThemedText style={{ color: '#D4AF37', marginLeft: 4 }}>Back</ThemedText>
                </TouchableOpacity>
                <HeaderTitle>ALERT PROTOCOLS</HeaderTitle>
                <View style={{ width: 40 }} />
            </Header>

            <Content>
                <SectionTitle>The War Room (Urgent)</SectionTitle>
                <Card>
                    <Row>
                        <Label>Draft Invites</Label>
                        <Switch
                            value={draftInvites}
                            onValueChange={setDraftInvites}
                            trackColor={{ false: "#767577", true: "#D4AF37" }}
                        />
                    </Row>
                    <Row style={{ marginBottom: 0 }}>
                        <Label>Live Now</Label>
                        <Switch
                            value={liveNow}
                            onValueChange={setLiveNow}
                            trackColor={{ false: "#767577", true: "#D4AF37" }}
                        />
                    </Row>
                </Card>

                <SectionTitle>Social (Casual)</SectionTitle>
                <Card>
                    <Row>
                        <Label>New Followers</Label>
                        <Switch
                            value={newFollowers}
                            onValueChange={setNewFollowers}
                            trackColor={{ false: "#767577", true: "#D4AF37" }}
                        />
                    </Row>
                    <Row style={{ marginBottom: 0 }}>
                        <Label>Mentions</Label>
                        <Switch
                            value={mentions}
                            onValueChange={setMentions}
                            trackColor={{ false: "#767577", true: "#D4AF37" }}
                        />
                    </Row>
                </Card>

                <SectionTitle>Delivery Method</SectionTitle>
                <Card>
                    <Row>
                        <Label>Push Notifications</Label>
                        <Switch
                            value={pushEnabled}
                            onValueChange={setPushEnabled}
                            trackColor={{ false: "#767577", true: "#D4AF37" }}
                        />
                    </Row>
                    <Row style={{ marginBottom: 0 }}>
                        <Label>Email Digests</Label>
                        <Switch
                            value={emailDigest}
                            onValueChange={setEmailDigest}
                            trackColor={{ false: "#767577", true: "#D4AF37" }}
                        />
                    </Row>
                </Card>
            </Content>
        </Container>
    );
}
