import { ThemedText } from '@/components/themed-text';
import { Button } from '@/src/components/atoms/Button';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #0A192F;
`;

const Header = styled.View`
  align-items: center;
  padding-top: 60px;
  padding-bottom: 30px;
`;

const CountDown = styled(ThemedText)`
  font-size: 48px;
  font-weight: 900;
  color: #D4AF37;
  font-family: serif;
  letter-spacing: 2px;
`;

const Label = styled(ThemedText)`
  font-size: 12px;
  color: #B0B3B8;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 12px;
`;

const MatchupCard = styled.View`
  margin: 24px;
  background-color: rgba(255,255,255,0.05);
  border-radius: 20px;
  padding: 30px;
  align-items: center;
  border-width: 1px;
  border-color: rgba(255,255,255,0.1);
`;

const VersusRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const AvatarLarge = styled(Image)`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border-width: 2px;
  border-color: rgba(255,255,255,0.2);
`;

const VsBolt = styled.View`
  width: 50px;
  height: 50px;
  background-color: #0A192F;
  border-width: 2px;
  border-color: #D4AF37;
  transform: rotate(45deg);
  align-items: center;
  justify-content: center;
`;

const VsText = styled(ThemedText)`
  transform: rotate(-45deg);
  font-weight: 900;
  color: #D4AF37;
  font-size: 16px;
`;

const TopicTitle = styled(ThemedText)`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-top: 24px;
  color: white;
  line-height: 32px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  margin-top: 16px;
  gap: 16px;
`;

const Badge = styled.View`
  background-color: rgba(212, 175, 55, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  border-width: 1px;
  border-color: rgba(212, 175, 55, 0.3);
`;

const Footer = styled.View`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 24px;
  background-color: #0A192F;
  border-top-width: 1px;
  border-top-color: rgba(255,255,255,0.1);
`;

export default function EventDetailScreen() {
    return (
        <Container>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: '',
                    headerTransparent: true,
                    headerTintColor: 'white'
                }}
            />

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                <Header>
                    <Label>Battle Begins In</Label>
                    <CountDown>02:14:55</CountDown>
                </Header>

                <MatchupCard>
                    <VersusRow>
                        <View style={{ alignItems: 'center' }}>
                            <AvatarLarge source={{ uri: 'https://i.pravatar.cc/300?u=1' }} />
                            <ThemedText style={{ marginTop: 8, fontWeight: 'bold' }}>Sarah</ThemedText>
                        </View>

                        <VsBolt>
                            <VsText>VS</VsText>
                        </VsBolt>

                        <View style={{ alignItems: 'center' }}>
                            <AvatarLarge source={{ uri: 'https://i.pravatar.cc/300?u=2' }} />
                            <ThemedText style={{ marginTop: 8, fontWeight: 'bold' }}>David</ThemedText>
                        </View>
                    </VersusRow>

                    <TopicTitle>Is AI Consciousness a Threat to Humanity?</TopicTitle>

                    <InfoRow>
                        <Badge><ThemedText style={{ color: '#D4AF37', fontSize: 12, fontWeight: 'bold' }}>Ranked Match</ThemedText></Badge>
                        <Badge><ThemedText style={{ color: '#D4AF37', fontSize: 12, fontWeight: 'bold' }}>50 Elo Stakes</ThemedText></Badge>
                    </InfoRow>
                </MatchupCard>

                <View style={{ padding: 24 }}>
                    <ThemedText style={{ color: '#B0B3B8', textAlign: 'center' }}>
                        Join 240 others waiting for this event.
                    </ThemedText>
                </View>

            </ScrollView>

            <Footer>
                <Button
                    label="NOTIFY ME (REMINDER)"
                    fullWidth
                    style={{ backgroundColor: '#D4AF37', marginBottom: 12 }}
                    labelStyle={{ color: '#0A192F', fontWeight: 'bold' }}
                    onPress={() => Alert.alert('Reminder Set!', 'We will notify you 5 minutes before the start.')}
                />
                <Button
                    label="ADD TO CALENDAR"
                    fullWidth
                    variant="outline"
                    onPress={() => Alert.alert('Exporting to Calendar...')}
                />
            </Footer>
        </Container>
    );
}
