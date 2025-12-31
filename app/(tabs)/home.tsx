import { ThemedText } from '@/components/themed-text';
import { FightPoster } from '@/src/components/molecules/FightPoster';
import { TimelineTicket } from '@/src/components/molecules/TimelineTicket';
import { ArenaHeader } from '@/src/components/organisms/ArenaHeader';
import { GauntletRail } from '@/src/components/organisms/GauntletRail';
import { PriorityStack } from '@/src/components/organisms/PriorityStack';
import { ProfilePeekModal } from '@/src/components/organisms/ProfilePeekModal';
import { useGetFeedQuery, useGetPriorityStackQuery, useGetTimelineQuery } from '@/src/store/api/homeApi';
import { useGetGauntletQuery } from '@/src/store/api/socialApi';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Platform, ScrollView, StatusBar, View } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #0A192F;
`;

const Content = styled.ScrollView`
  padding-top: ${Platform.OS === 'ios' ? 100 : 80}px;
`;

const SectionHeader = styled.View`
  padding-horizontal: 16px;
  margin-top: 24px;
  margin-bottom: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled(ThemedText)`
  font-size: 14px;
  font-weight: 700;
  color: #D4AF37;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const { width } = Dimensions.get('window');

// Helper to format date for Timeline
const formatTimelineDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth();
    const isTomorrow = date.getDate() === now.getDate() + 1 && date.getMonth() === now.getMonth();

    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isToday) return `TODAY ${time}`;
    if (isTomorrow) return `TMRW ${time}`;
    return `${date.toLocaleDateString([], { weekday: 'short' }).toUpperCase()} ${time}`;
};

export default function HomeScreen() {
    const router = useRouter();
    const [focusedFight, setFocusedFight] = useState<string | null>(null);
    const [peekUser, setPeekUser] = useState<any>(null);

    // API Data
    const { data: priorityStackData, isLoading: isStackLoading } = useGetPriorityStackQuery(undefined);
    const { data: timelineData, isLoading: isTimelineLoading } = useGetTimelineQuery(undefined);
    const { data: feedData, isLoading: isFeedLoading } = useGetFeedQuery(undefined);
    const { data: gauntletData, isLoading: isGauntletLoading } = useGetGauntletQuery(undefined);

    // Mapped Data
    const liveNow = (priorityStackData?.message?.live_now || []) as any[];
    const challenges = (priorityStackData?.message?.challenges || []) as any[];

    // Combine for Priority Stack
    const activeTasksSource = [
        ...liveNow.map(d => ({ ...d, type: 'DEBATE' })),
        ...challenges.map(c => ({ ...c, type: 'CHALLENGE' }))
    ];

    const activeTasks = activeTasksSource.map((card: any) => {
        if (card.type === 'CHALLENGE') {
            return {
                id: card.id,
                role: 'challenger', // or 'challenged' based on user id, but logic needs current user id. For now assuming incoming.
                title: 'Challenger Approaching',
                topic: 'Unknown Topic', // Challenge model doesn't join topic yet in service? Check service. Service includes 'challenger'.
                status: 'Action Required',
                type: 'INCOMING_CHALLENGE',
                ...card
            };
        } else {
            // DEBATE
            return {
                id: card.id,
                role: 'participant', // Logic to determine role (Host vs Captain) needed if simpler
                title: card.title || 'Untitled Debate',
                topic: card.topic?.name || 'General',
                status: card.status === 'LIVE' ? 'LIVE' : 'UPCOMING',
                type: 'DEBATE',
                ...card
            };
        }
    });

    const scheduledTasksSource = timelineData?.message || [];
    const scheduledTasks = (Array.isArray(scheduledTasksSource) ? scheduledTasksSource : []).map((event: any) => ({
        id: event.id,
        time: formatTimelineDate(event.scheduled_at),
        topic: event.title,
        role: event.host ? 'Host' : 'Participant',
    }));

    const fightsSource = feedData?.message || [];
    const fights = (Array.isArray(fightsSource) ? fightsSource : []).map((item: any) => ({
        id: item.id,
        title: item.title,
        viewers: item.spectators?.length || '0',
        u1: item.host?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=u1',
        u2: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u2', // Placeholder until 2nd participant logic
    }));

    const gauntletSource = gauntletData?.message?.gauntlet || [];
    const gauntletItems = (Array.isArray(gauntletSource) ? gauntletSource : []).map((item: any) => ({
        id: item.id,
        topic: item.topic?.name || 'Open Challenge',
        elo: item.host?.elo_rating || 1200,
        avatar: item.host?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=gauntlet',
    }));

    const isBusy = activeTasks.some((t: any) => ['captain', 'solo', 'host_live'].includes(t.role));

    // Smart Router based on Role
    const handleTaskPress = (id: string, role: string) => {
        // Find the specific card to know specific params if needed
        const task = activeTasks.find((t: any) => t.id === id);

        // Example routing logic
        // If it's a challenge, go to challenge screen
        if (task?.type === 'INCOMING_CHALLENGE') {
            // Need a challenge detail screen/modal, assuming '/challenge/[id]'
            // For now redirect to explore tab
            router.push('/explore');
            return;
        }

        if (role === 'captain') {
            router.push({ pathname: '/live/[id]', params: { id, role: 'captain' } });
        } else {
            router.push({ pathname: '/live/[id]', params: { id, role } });
        }
    };

    // Navigation Protection
    const handleSpectateAttempt = (fightId: string) => {
        if (isBusy) {
            Alert.alert(
                "Abandon Team?",
                "You are the Captain of Team A. Leaving now to spectate will forfeit your leadership role.",
                [
                    { text: "Stay in Cockpit", style: "cancel" },
                    {
                        text: "Leave & Spectate",
                        style: "destructive",
                        onPress: () => router.push({ pathname: '/live/[id]', params: { id: fightId, role: 'spectator' } })
                    }
                ]
            );
        } else {
            router.push({ pathname: '/live/[id]', params: { id: fightId, role: 'spectator' } });
        }
    };

    const isLoading = isStackLoading || isTimelineLoading || isFeedLoading;

    return (
        <Container>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <ArenaHeader onFilter={() => { }} />

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#D4AF37" />
                </View>
            ) : (
                <Content contentContainerStyle={{ paddingBottom: 150 }}>
                    {/* Zone A: The Priority Stack (Carousel) */}
                    {activeTasks.length > 0 && (
                        <View style={{ marginBottom: 24 }}>
                            <SectionHeader style={{ marginTop: 0 }}>
                                <SectionTitle style={{ color: '#FFD700' }}>PRIORITY TASKS</SectionTitle>
                            </SectionHeader>
                            <PriorityStack
                                items={activeTasks}
                                onPressItem={handleTaskPress}
                            />
                        </View>
                    )}

                    {/* Zone B: The Timeline (Rail) */}
                    <View style={{ marginBottom: 24 }}>
                        <SectionHeader style={{ marginTop: 0 }}>
                            <SectionTitle style={{ color: '#B0B3B8' }}>UPCOMING</SectionTitle>
                        </SectionHeader>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                            {scheduledTasks.length > 0 ? scheduledTasks.map((task: any) => (
                                <TimelineTicket
                                    key={task.id}
                                    time={task.time}
                                    topic={task.topic}
                                    role={task.role}
                                    onPress={() => Alert.alert('Scheduled', `Opening details for ${task.topic}`)}
                                    isUrgent={task.role === 'captain'}
                                />
                            )) : (
                                <ThemedText style={{ color: '#666', fontStyle: 'italic' }}>No upcoming debates.</ThemedText>
                            )}
                        </ScrollView>
                    </View>

                    {/* Zone C: Global Feed (Protected) */}
                    <SectionHeader>
                        <SectionTitle>On Stage Now</SectionTitle>
                        <ThemedText style={{ fontSize: 12, color: '#B0B3B8' }}>View All</ThemedText>
                    </SectionHeader>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                        snapToInterval={width * 0.85 + 16}
                        decelerationRate="fast"
                    >
                        {fights.map((fight: any) => (
                            <FightPoster
                                key={fight.id}
                                title={fight.title}
                                viewers={fight.viewers}
                                avatar1={fight.u1}
                                avatar2={fight.u2}
                                isFocused={focusedFight === fight.id}
                                onPress={() => handleSpectateAttempt(fight.id)}
                                onLongPress={() => setFocusedFight(focusedFight === fight.id ? null : fight.id)}
                            />
                        ))}
                    </ScrollView>

                    {/* Zone D: The Gauntlet */}
                    <SectionHeader>
                        <SectionTitle>The Gauntlet</SectionTitle>
                    </SectionHeader>
                    <GauntletRail
                        items={gauntletItems}
                        onPressItem={(item) => setPeekUser({ name: 'Challenger', avatar: item.avatar })}
                    />

                    {/* Visual Divider / Footer Space */}
                    <View style={{ height: 40 }} />
                </Content>
            )}

            <ProfilePeekModal
                visible={!!peekUser}
                user={peekUser}
                onClose={() => setPeekUser(null)}
            />
        </Container>
    );
}
