import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/src/components/atoms/Button';
import { LeaderboardRow } from '@/src/components/molecules/LeaderboardRow';
import { RankBadge } from '@/src/components/molecules/RankBadge';
import { useTheme } from '@/src/hooks';
import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';

const Container = styled(ThemedView) <{ theme: any }>`
  flex: 1;
`;

const HeroSection = styled.View<{ theme: any }>`
  padding: ${props => props.theme.spacing.lg}px;
  background-color: ${props => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const HeroTitle = styled(ThemedText)`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const StatRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const StatItem = styled.View`
  align-items: center;
`;

const SectionTitle = styled(ThemedText)`
  margin: 16px;
  font-size: 18px;
  font-weight: 600;
`;

const MOCK_LEADERBOARD = [
    { rank: 1, name: 'LogicMaster', avatar: 'https://i.pravatar.cc/150?u=10', rating: 2450 },
    { rank: 2, name: 'SarahDebates', avatar: 'https://i.pravatar.cc/150?u=11', rating: 2390 },
    { rank: 3, name: 'ThePhilosopher', avatar: 'https://i.pravatar.cc/150?u=12', rating: 2310 },
    { rank: 47, name: 'Demo User', avatar: 'https://i.pravatar.cc/150?u=kora', rating: 1847, isCurrentUser: true },
    { rank: 48, name: 'NextChallenger', avatar: 'https://i.pravatar.cc/150?u=13', rating: 1840 },
];

export default function LadderScreen() {
    const theme = useTheme();

    return (
        <Container theme={theme}>
            <FlatList
                data={MOCK_LEADERBOARD}
                keyExtractor={item => item.name}
                ListHeaderComponent={
                    <>
                        <HeroSection theme={theme}>
                            <HeroTitle>My Ladder</HeroTitle>
                            <RankBadge rank={47} division="Gold III" rating={1847} />

                            <StatRow>
                                <StatItem>
                                    <ThemedText type="defaultSemiBold">12</ThemedText>
                                    <ThemedText style={{ fontSize: 12 }}>Matches</ThemedText>
                                </StatItem>
                                <StatItem>
                                    <ThemedText type="defaultSemiBold">75%</ThemedText>
                                    <ThemedText style={{ fontSize: 12 }}>Win Rate</ThemedText>
                                </StatItem>
                                <StatItem>
                                    <ThemedText type="defaultSemiBold">4</ThemedText>
                                    <ThemedText style={{ fontSize: 12 }}>Streak</ThemedText>
                                </StatItem>
                            </StatRow>

                            <Button label="Find Match" fullWidth />
                        </HeroSection>

                        <SectionTitle>Global Leaderboard</SectionTitle>
                    </>
                }
                renderItem={({ item }) => (
                    <LeaderboardRow {...item} />
                )}
            />
        </Container>
    );
}
