import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');

interface AudienceTabsProps {
    spectators: { id: string; name: string; avatar: string; role?: string }[];
    documents: { id: string; title: string; type: 'image' | 'pdf'; thumbnail: string }[];
    onPresentDoc: (docId: string) => void;
    onRequestJoin: (team: 'A' | 'B') => void;
}

const Container = styled.View`
  flex: 1;
  background-color: #020C1B;
`;

const TabHeader = styled.View`
  flex-direction: row;
  height: 40px;
  border-bottom-width: 1px;
  border-color: rgba(255,255,255,0.1);
`;

const TabButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  border-bottom-width: 2px;
  border-color: ${props => props.active ? '#D4AF37' : 'transparent'};
`;

const SpectatorItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  border-bottom-width: 1px;
  border-color: rgba(255,255,255,0.05);
`;

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 12px;
`;

const JoinBtn = styled.TouchableOpacity`
  background-color: rgba(255,255,255,0.1);
  padding: 6px 12px;
  border-radius: 16px;
  border-width: 1px;
  border-color: rgba(255,255,255,0.2);
`;

const DocItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 12px 20px;
  background-color: rgba(255,255,255,0.02);
  margin-bottom: 2px;
`;

const Thumbnail = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 12px;
  background-color: #333;
`;

export const AudienceTabs = ({ spectators, documents, onPresentDoc, onRequestJoin }: AudienceTabsProps) => {
    const [activeTab, setActiveTab] = useState<'spectators' | 'docs'>('spectators');

    return (
        <Container>
            <TabHeader>
                <TabButton active={activeTab === 'spectators'} onPress={() => setActiveTab('spectators')}>
                    <ThemedText style={{ color: activeTab === 'spectators' ? '#D4AF37' : 'grey', fontWeight: 'bold' }}>
                        SPECTATORS ({spectators.length})
                    </ThemedText>
                </TabButton>
                <TabButton active={activeTab === 'docs'} onPress={() => setActiveTab('docs')}>
                    <ThemedText style={{ color: activeTab === 'docs' ? '#D4AF37' : 'grey', fontWeight: 'bold' }}>
                        EVIDENCE ({documents.length})
                    </ThemedText>
                </TabButton>
            </TabHeader>

            {activeTab === 'spectators' ? (
                <FlatList
                    data={spectators}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <SpectatorItem>
                            <Avatar source={{ uri: item.avatar }} />
                            <View style={{ flex: 1 }}>
                                <ThemedText style={{ fontWeight: 'bold' }}>{item.name}</ThemedText>
                                <ThemedText style={{ fontSize: 10, color: 'grey' }}>Viewer</ThemedText>
                            </View>
                            <JoinBtn onPress={() => onRequestJoin('A')}>
                                <ThemedText style={{ fontSize: 10 }}>Request Join</ThemedText>
                            </JoinBtn>
                        </SpectatorItem>
                    )}
                />
            ) : (
                <FlatList
                    data={documents}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <DocItem onPress={() => onPresentDoc(item.id)}>
                            <Thumbnail source={{ uri: item.thumbnail }} />
                            <View>
                                <ThemedText style={{ fontWeight: 'bold' }}>{item.title}</ThemedText>
                                <ThemedText style={{ fontSize: 10, color: '#00FFFF' }}>Tap to Present</ThemedText>
                            </View>
                            <View style={{ flex: 1 }} />
                            <IconSymbol name="eye.fill" size={16} color="grey" />
                        </DocItem>
                    )}
                />
            )}
        </Container>
    );
};
