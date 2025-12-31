import { ThemedText } from '@/components/themed-text';
import { GauntletCard } from '@/src/components/molecules/GauntletCard';
import { ZeitgeistCloud } from '@/src/components/molecules/ZeitgeistCloud';
import { AcceptDuelModal } from '@/src/components/organisms/AcceptDuelModal';
import { ExploreHeader } from '@/src/components/organisms/ExploreHeader';
import { useAcceptChallengeMutation, useGetGauntletQuery } from '@/src/store/api/socialApi';
import { useGetLeaderboardQuery } from '@/src/store/api/usersApi';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, StatusBar, View } from 'react-native';
import styled from 'styled-components/native';

const MainContainer = styled.View`
  flex: 1;
  background-color: #0A192F;
`;

const ContentContainer = styled.ScrollView`
  flex: 1;
  padding-top: ${Platform.OS === 'ios' ? 120 : 100}px;
`;

const SectionHeader = styled(ThemedText)`
  font-size: 14px;
  font-weight: 700;
  color: #D4AF37;
  letter-spacing: 2px;
  margin-bottom: 12px;
  text-transform: uppercase;
  padding-horizontal: 16px;
`;

const HorizontalSection = styled.ScrollView`
  padding-left: 16px;
  margin-bottom: 32px;
`;

const GauntletContainer = styled.View`
  margin-bottom: 32px;
`;

// -- Leaderboard Widget --
const LeaderboardWidget = styled.View`
  margin-horizontal: 16px;
  background-color: #1A2744;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 32px;
  border-width: 1px;
  border-color: rgba(255,255,255,0.1);
`;

const LeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const RankCircle = styled.View<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${props => props.color};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const RankText = styled(ThemedText)`
  font-size: 10px;
  font-weight: bold;
`;

// -- Collections --
const CollectionCard = styled.View`
  height: 120px;
  background-color: rgba(255,255,255,0.05);
  margin-bottom: 16px;
  border-radius: 12px;
  justify-content: center;
  padding: 16px;
  margin-horizontal: 16px;
`;

// Mock Collections (No API yet)
const COLLECTIONS = ['Classic Debates', 'Rising Stars', 'University League', 'Philosophy', 'Economics'];

export default function ExploreScreen() {
  const [duelModal, setDuelModal] = useState<{ visible: boolean; challenger: any | null }>({ visible: false, challenger: null });

  // API Hooks
  const { data: gauntletData, isLoading: isGauntletLoading } = useGetGauntletQuery(undefined);
  const { data: leaderboardData, isLoading: isLeaderboardLoading } = useGetLeaderboardQuery(undefined);
  const [acceptChallenge, { isLoading: isAccepting }] = useAcceptChallengeMutation();

  // Helper to extract array safely
  const getArrayData = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.message)) return data.message;
    return [];
  };

  // Mapped Data
  const gauntletList = getArrayData(gauntletData);
  const gauntletChallenges = gauntletList.map((item: any) => ({
    id: item.id,
    topic: item.topic?.name || item.title || 'Unknown Topic',
    challenger: {
      name: item.challenger?.handle || 'Unknown',
      rating: item.challenger?.elo || 0,
      avatar: item.challenger?.avatar_url || 'https://via.placeholder.com/150',
      id: item.challenger?.id // Keep ID for acceptance
    }
  }));

  const leaderboardList = getArrayData(leaderboardData);
  const topDebaters = leaderboardList.map((user: any, index: number) => ({
    rank: index + 1,
    name: user.handle,
    score: user.elo,
    color: index === 0 ? '#D4AF37' : (index === 1 ? '#C0C0C0' : '#CD7F32'),
  }));

  const handleAcceptDuel = async () => {
    if (!duelModal.challenger?.id) return;
    try {
      await acceptChallenge(duelModal.challenger.id).unwrap();
      Alert.alert('Success', 'Challenge Accepted');
      setDuelModal({ visible: false, challenger: null });
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to accept challenge');
    }
  };

  const isLoading = isGauntletLoading || isLeaderboardLoading;

  return (
    <MainContainer>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ExploreHeader />

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#D4AF37" />
        </View>
      ) : (
        <ContentContainer showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* 1. The Zeitgeist */}
          <ZeitgeistCloud />

          {/* 2. The Gauntlet */}
          <GauntletContainer>
            <SectionHeader>The Gauntlet</SectionHeader>
            <HorizontalSection horizontal showsHorizontalScrollIndicator={false}>
              {gauntletChallenges.length > 0 ? gauntletChallenges.map((c: any) => (
                <GauntletCard
                  key={c.id}
                  challenger={c.challenger}
                  topic={c.topic}
                  onAccept={() => setDuelModal({ visible: true, challenger: { ...c.challenger, challengeId: c.id } })}
                />
              )) : (
                <ThemedText style={{ marginLeft: 16, opacity: 0.5 }}>No active challenges.</ThemedText>
              )}
            </HorizontalSection>
          </GauntletContainer>

          {/* 3. Leaderboard Widget */}
          <SectionHeader>Top Debaters (This Week)</SectionHeader>
          <LeaderboardWidget>
            {topDebaters.length > 0 ? topDebaters.slice(0, 5).map((d: any) => (
              <LeaderRow key={d.rank}>
                <RankCircle color={d.color}>
                  <RankText>{d.rank}</RankText>
                </RankCircle>
                <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>{d.name}</ThemedText>
                <ThemedText style={{ color: '#D4AF37' }}>{d.score}</ThemedText>
              </LeaderRow>
            )) : (
              <ThemedText style={{ opacity: 0.5 }}>Leaderboard loading...</ThemedText>
            )}
          </LeaderboardWidget>

          {/* 4. Collections */}
          <SectionHeader>Collections</SectionHeader>
          {COLLECTIONS.map((c, i) => (
            <CollectionCard key={i}>
              <ThemedText type="subtitle">{c}</ThemedText>
              <ThemedText style={{ opacity: 0.5, fontSize: 12 }}>{Math.floor(Math.random() * 50) + 10} Debates</ThemedText>
            </CollectionCard>
          ))}

        </ContentContainer>
      )}

      <AcceptDuelModal
        visible={duelModal.visible}
        challenger={duelModal.challenger}
        onClose={() => setDuelModal({ visible: false, challenger: null })}
        onConfirm={async () => {
          if (duelModal.challenger?.challengeId) {
            try {
              await acceptChallenge(duelModal.challenger.challengeId).unwrap();
              Alert.alert('FIGHT STARTED', 'Entering the arena...');
              setDuelModal({ visible: false, challenger: null });
            } catch (err) {
              Alert.alert('Error', 'Failed to accept.');
            }
          }
        }}
      />
    </MainContainer>
  );
}
