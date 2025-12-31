import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, TextInput, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #0A192F;
`;

const SearchHeader = styled.View`
  background-color: #0A192F;
  padding-top: 60px;
  padding-horizontal: 16px;
  padding-bottom: 16px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255,255,255,0.1);
`;

const SearchBarWrapper = styled.View`
  height: 44px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 12px;
  margin-bottom: 16px;
`;

const SearchInput = styled(TextInput)`
  flex: 1;
  color: white;
  margin-left: 8px;
  font-size: 16px;
`;

const FilterTabs = styled.ScrollView`
  flex-direction: row;
`;

const Tab = styled.TouchableOpacity<{ active: boolean }>`
  padding-vertical: 8px;
  padding-horizontal: 16px;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.active ? '#D4AF37' : 'transparent'};
  margin-right: 16px;
`;

const TabText = styled(ThemedText) <{ active: boolean }>`
  color: ${props => props.active ? '#D4AF37' : '#B0B3B8'};
  font-weight: 600;
`;

const ResultCard = styled.View`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255,255,255,0.05);
`;

export default function SearchScreen() {
    const { query } = useLocalSearchParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Top');
    const [searchText, setSearchText] = useState(query as string || '');

    const TABS = ['Top', 'Debates', 'People', 'Tags'];

    // Mock Results
    const RESULTS = [
        { id: '1', type: 'user', name: 'AI_Ethicist', desc: 'Debating the future of synthetic minds.' },
        { id: '2', type: 'debate', title: 'The Future of AI Ethics', viewers: '1.2k' },
        { id: '3', type: 'tag', name: '#ArtificialIntelligence' },
    ];

    return (
        <Container>
            <Stack.Screen options={{ headerShown: false }} />
            <SearchHeader>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
                        <IconSymbol name="chevron.left" size={24} color="white" />
                    </TouchableOpacity>
                    <SearchBarWrapper style={{ flex: 1, marginBottom: 0 }}>
                        <IconSymbol name="magnifyingglass" size={20} color="rgba(255,255,255,0.5)" />
                        <SearchInput
                            value={searchText}
                            onChangeText={setSearchText}
                            placeholder="Search..."
                            placeholderTextColor="rgba(255,255,255,0.5)"
                            autoFocus={false}
                        />
                    </SearchBarWrapper>
                </View>

                <FilterTabs horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
                    {TABS.map(tab => (
                        <Tab key={tab} active={activeTab === tab} onPress={() => setActiveTab(tab)}>
                            <TabText active={activeTab === tab}>{tab}</TabText>
                        </Tab>
                    ))}
                </FilterTabs>
            </SearchHeader>

            <FlatList
                data={RESULTS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ResultCard>
                        <ThemedText style={{ fontWeight: 'bold', fontSize: 16 }}>
                            {item.type === 'user' ? item.name : item.type === 'debate' ? item.title : item.name}
                        </ThemedText>
                        <ThemedText style={{ color: '#B0B3B8', marginTop: 4 }}>
                            {item.type === 'user' ? item.desc : item.type === 'debate' ? `Live • ${item.viewers} listening` : 'Trending Topic'}
                        </ThemedText>
                    </ResultCard>
                )}
            />
        </Container>
    );
}
