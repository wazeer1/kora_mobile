import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ActivityFilter, FilterType } from '@/src/components/molecules/ActivityFilter';
import { NotificationCard, NotificationData } from '@/src/components/molecules/NotificationCard';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SectionList, View } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #0A192F;
`;

const SectionHeader = styled(ThemedText)`
  font-size: 14px;
  font-weight: bold;
  color: #B0B3B8;
  margin-bottom: 8px;
  margin-top: 16px;
  margin-left: 24px;
  text-transform: uppercase;
`;

const EmptyState = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px;
  opacity: 0.5;
`;

const MockNotifications: NotificationData[] = [
  {
    id: '1', type: 'live', title: 'LIVE NOW: Tax Reform', body: 'Your debate "Is Taxation Theft?" has started. You are late for the stage!',
    time: 'Now', read: false
  },
  {
    id: '2', type: 'draft', title: 'Team Draft Pick', body: '@Wazeer drafted you as Captain (Side A) for "AI vs Humanity".',
    time: '2m ago', avatar: 'https://i.pravatar.cc/100?u=wazeer', read: false
  },
  {
    id: '3', type: 'gauntlet', title: 'New Challenge', body: '@DebateKing threw down a gauntlet: "Crypto is a Scam". Stakes: 50 Rep.',
    time: '1h ago', read: true
  },
  {
    id: '4', type: 'system', title: 'Mentioned you', body: '@Janesmith and 49 others agreed with your argument on "Universal Basic Income".',
    time: '5h ago', avatar: 'https://i.pravatar.cc/100?u=jane', read: true
  },
  {
    id: '5', type: 'verdict', title: 'Victory! You earned +24 Elo', body: 'The verdict is in for "Mars Colonization". Efficiency Score: 92%.',
    time: 'Yesterday', read: true
  }
];

export default function ActivityScreen() {
  const [filter, setFilter] = useState<FilterType>('All');

  const filteredData = MockNotifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Requests') return ['draft', 'gauntlet'].includes(n.type);
    if (filter === 'Mentions') return ['system'].includes(n.type) && n.body.includes('agreed');
    if (filter === 'System') return ['system', 'verdict'].includes(n.type);
    return true;
  });

  const groupedData = [
    { title: 'New', data: filteredData.filter(d => ['1', '2'].includes(d.id)) },
    { title: 'Today', data: filteredData.filter(d => ['3', '4'].includes(d.id)) },
    { title: 'Yesterday', data: filteredData.filter(d => ['5'].includes(d.id)) }
  ].filter(section => section.data.length > 0);

  const handleAction = (id: string, action: string) => {
    if (action === 'accept') Alert.alert('Role Accepted', 'You are now the Captain of Side A.');
    if (action === 'decline') Alert.alert('Role Declined');
    if (action === 'join') Alert.alert('Joining Room...');
  };

  return (
    <Container>
      <Stack.Screen options={{ headerShown: true, title: 'Activity', headerStyle: { backgroundColor: '#0A192F' }, headerTintColor: 'white' }} />

      <ActivityFilter
        activeFilter={filter}
        onSelect={setFilter}
        requestCount={2}
      />

      {groupedData.length > 0 ? (
        <SectionList
          sections={groupedData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 24 }}>
              <NotificationCard
                item={item}
                onAction={(action) => handleAction(item.id, action)}
              />
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <SectionHeader>{title}</SectionHeader>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <EmptyState>
          <IconSymbol name="bell.fill" size={48} color="rgba(255,255,255,0.2)" />
          <ThemedText style={{ marginTop: 16, color: '#B0B3B8', textAlign: 'center' }}>
            No pending items in {filter}. Go find a fight in the Arena.
          </ThemedText>
        </EmptyState>
      )}
    </Container>
  );
}
