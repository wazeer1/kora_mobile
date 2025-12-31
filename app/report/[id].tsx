import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/src/components/atoms/Button';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  background-color: #0A192F;
`;

const HeaderContainer = styled.View`
  height: 250px;
  position: relative;
`;

const CoverImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const Overlay = styled(LinearGradient)`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  justify-content: center;
  align-items: center;
`;

const ResultBadge = styled.View<{ isVictory: boolean }>`
  padding: 12px 24px;
  background-color: rgba(0,0,0,0.6);
  border-width: 2px;
  border-color: ${props => props.isVictory ? '#D4AF37' : '#B0B3B8'};
  border-radius: 8px;
  margin-bottom: 16px;
`;

const ScoreBoard = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  padding-horizontal: 24px;
  margin-top: 20px;
`;

const ScoreItem = styled.View`
  align-items: center;
`;

const AISection = styled.View`
  padding: 24px;
  background-color: rgba(255,255,255,0.05);
  margin: 24px;
  border-radius: 12px;
  border-left-width: 4px;
  border-left-color: #4ECDC4;
`;

const BulletPoint = styled.View`
  flex-direction: row;
  margin-top: 12px;
`;

const Footer = styled.View`
  padding: 24px;
  border-top-width: 1px;
  border-top-color: rgba(255,255,255,0.1);
  background-color: #0A192F;
`;

export default function GameReportScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const isVictory = true; // Mock

    return (
        <Container>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Game Report',
                    headerTransparent: true,
                    headerTintColor: 'white'
                }}
            />

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <HeaderContainer>
                    <CoverImage source={{ uri: 'https://picsum.photos/800/600' }} />
                    <Overlay colors={['rgba(0,0,0,0.3)', '#0A192F']}>
                        <View style={{ height: 60 }} />
                        <ResultBadge isVictory={isVictory}>
                            <ThemedText type="title" style={{ color: isVictory ? '#D4AF37' : '#B0B3B8', textTransform: 'uppercase' }}>
                                {isVictory ? 'VICTORY' : 'DEFEAT'}
                            </ThemedText>
                        </ResultBadge>
                        <ThemedText style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Mars Colonization</ThemedText>
                        <ThemedText style={{ color: '#B0B3B8', fontSize: 14 }}>Efficiency Score: 92%</ThemedText>
                    </Overlay>
                </HeaderContainer>

                <ScoreBoard>
                    <ScoreItem>
                        <ThemedText style={{ color: '#B0B3B8', fontSize: 12 }}>ELO RATING</ThemedText>
                        <ThemedText type="title" style={{ color: isVictory ? '#4ECDC4' : '#FF6B6B' }}>1424</ThemedText>
                        <ThemedText style={{ color: isVictory ? '#4ECDC4' : '#FF6B6B', fontSize: 12, fontWeight: 'bold' }}>
                            {isVictory ? '+24' : '-12'}
                        </ThemedText>
                    </ScoreItem>
                    <ScoreItem>
                        <ThemedText style={{ color: '#B0B3B8', fontSize: 12 }}>TOTAL VOTES</ThemedText>
                        <ThemedText type="title">1,205</ThemedText>
                    </ScoreItem>
                </ScoreBoard>

                <AISection>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <IconSymbol name="sparkles" size={20} color="#4ECDC4" />
                        <ThemedText style={{ marginLeft: 8, fontWeight: 'bold', color: '#4ECDC4' }}>AI REFEREE'S VERDICT</ThemedText>
                    </View>

                    <BulletPoint>
                        <ThemedText style={{ color: '#4ECDC4', marginRight: 8 }}>•</ThemedText>
                        <ThemedText style={{ flex: 1, color: '#E0E0E0' }}>
                            Side A relied heavily on empirical data regarding inflation, strengthening their premise efficiently.
                        </ThemedText>
                    </BulletPoint>
                    <BulletPoint>
                        <ThemedText style={{ color: '#FF6B6B', marginRight: 8 }}>•</ThemedText>
                        <ThemedText style={{ flex: 1, color: '#E0E0E0' }}>
                            Side B committed an "Appeal to Emotion" fallacy in Round 2 which undermined their logical standing.
                        </ThemedText>
                    </BulletPoint>
                    <BulletPoint>
                        <ThemedText style={{ color: '#D4AF37', marginRight: 8 }}>•</ThemedText>
                        <ThemedText style={{ flex: 1, color: '#E0E0E0' }}>
                            Crossfire engagement favored Side A due to faster rebuttal times.
                        </ThemedText>
                    </BulletPoint>
                </AISection>

            </ScrollView>

            <Footer>
                <Button
                    label="WATCH REPLAY"
                    onPress={() => { }}
                    fullWidth
                    style={{ backgroundColor: '#D4AF37', marginBottom: 12 }}
                    labelStyle={{ color: '#0A192F', fontWeight: 'bold' }}
                />
                <Button
                    label="SHARE REPORT"
                    onPress={() => { }}
                    fullWidth
                    variant="outline"
                />
            </Footer>
        </Container>
    );
}
