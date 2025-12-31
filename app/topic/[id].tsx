import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/src/components/atoms/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ImageBackground, ScrollView, TouchableOpacity, View } from 'react-native';
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

const HeaderImage = styled(ImageBackground)`
  width: 100%;
  height: 100%;
`;

const HeaderContent = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
`;

const Title = styled(ThemedText)`
  font-family: serif;
  font-size: 32px;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
`;

const StatsRow = styled.View`
  flex-direction: row;
  gap: 16px;
`;

const StatText = styled(ThemedText)`
  color: #D4AF37;
  font-weight: 600;
`;

const Section = styled.View`
  padding: 24px;
`;

const SectionTitle = styled(ThemedText)`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
  color: white;
`;

const DebateCard = styled.View`
  background-color: rgba(255,255,255,0.05);
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  border-left-width: 4px;
  border-left-color: #D4AF37;
`;

export default function TopicScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const topicName = typeof id === 'string' ? id.charAt(0).toUpperCase() + id.slice(1) : 'Topic';

    return (
        <Container>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView showsVerticalScrollIndicator={false}>
                <HeaderContainer>
                    <HeaderImage source={{ uri: 'https://source.unsplash.com/random?abstract,technology' }}>
                        <LinearGradient
                            colors={['transparent', '#0A192F']}
                            style={{ flex: 1 }}
                        />
                    </HeaderImage>
                    <HeaderContent>
                        <Title>{topicName}</Title>
                        <StatsRow>
                            <StatText>12k Active Debaters</StatText>
                            <StatText>•</StatText>
                            <StatText>45 Live Rooms</StatText>
                        </StatsRow>
                    </HeaderContent>

                    {/* Back Button */}
                    <View style={{ position: 'absolute', top: 50, left: 20 }}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <IconSymbol name="chevron.left" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                </HeaderContainer>

                <Section>
                    <SectionTitle>The Canon</SectionTitle>
                    <DebateCard>
                        <ThemedText style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>Top Debate of All Time</ThemedText>
                        <ThemedText style={{ color: '#B0B3B8' }}>4.5k Deltas • 2 years ago</ThemedText>
                    </DebateCard>
                    <DebateCard>
                        <ThemedText style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>Foundational Principles</ThemedText>
                        <ThemedText style={{ color: '#B0B3B8' }}>3.2k Deltas • 1 year ago</ThemedText>
                    </DebateCard>
                </Section>

                <Section>
                    <SectionTitle>Fresh Blood</SectionTitle>
                    <DebateCard>
                        <ThemedText style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>New Argument: Impact on Jobs</ThemedText>
                        <ThemedText style={{ color: '#B0B3B8' }}>just now</ThemedText>
                    </DebateCard>
                </Section>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* FAB */}
            <View style={{ position: 'absolute', bottom: 40, right: 20, left: 20 }}>
                <Button
                    label={`Debate ${topicName}`}
                    onPress={() => { }}
                    fullWidth
                    style={{ backgroundColor: '#D4AF37', borderRadius: 30, height: 60 }}
                    labelStyle={{ color: '#0A192F', fontWeight: 'bold', fontSize: 16 }}
                />
            </View>
        </Container>
    );
}
