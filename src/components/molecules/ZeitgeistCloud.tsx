import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  margin-bottom: 24px;
`;

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: 16px;
  margin-bottom: 12px;
`;

const FireIcon = styled(View)`
  margin-left: 6px;
`;

const ScrollContent = styled.ScrollView`
  padding-left: 16px;
`;

// Heat Level determines color opacity/intensity
// 1 = Cold (Blue/Grey), 2 = Warm (Light Gold), 3 = Hot (Glowing Gold/Orange)
const TopicPill = styled.TouchableOpacity<{ heat: number }>`
  padding-horizontal: 16px;
  padding-vertical: 8px;
  border-radius: 20px;
  margin-right: 12px;
  background-color: ${props =>
    props.heat === 3 ? 'rgba(212, 175, 55, 0.2)' :
      props.heat === 2 ? 'rgba(255, 255, 255, 0.1)' :
        'rgba(255, 255, 255, 0.05)'
  };
  border-width: 1px;
  border-color: ${props =>
    props.heat === 3 ? '#D4AF37' :
      props.heat === 2 ? 'rgba(255, 255, 255, 0.3)' :
        'transparent'
  };
  flex-direction: row;
  align-items: center;
`;

const TopicText = styled(ThemedText) <{ heat: number }>`
  font-weight: 600;
  color: ${props => props.heat === 3 ? '#D4AF37' : 'white'};
  font-size: 14px;
`;

interface Topic {
  id: string;
  name: string;
  heat: 1 | 2 | 3;
}

const MOCK_TOPICS: Topic[] = [
  { id: '1', name: 'Artificial Intelligence', heat: 3 },
  { id: '2', name: 'Crypto Regulation', heat: 3 },
  { id: '3', name: 'Universal Basic Income', heat: 2 },
  { id: '4', name: 'Mars Colonization', heat: 2 },
  { id: '5', name: 'Modern Art', heat: 1 },
  { id: '6', name: 'Stoicism', heat: 1 },
];

export const ZeitgeistCloud = () => {
  const router = useRouter();
  return (
    <Container>
      <TitleRow>
        <ThemedText type="subtitle" style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#B0B3B8' }}>The Zeitgeist</ThemedText>
        <FireIcon>
          <IconSymbol name="flame.fill" size={14} color="#FF6B6B" />
        </FireIcon>
      </TitleRow>

      <ScrollContent horizontal showsHorizontalScrollIndicator={false}>
        {MOCK_TOPICS.map(topic => (
          <TopicPill key={topic.id} heat={topic.heat} onPress={() => router.push(`/topic/${topic.name.toLowerCase()}`)}>
            <TopicText heat={topic.heat}>{topic.name}</TopicText>
            {topic.heat === 3 && (
              <IconSymbol name="arrow.up.right" size={12} color="#D4AF37" style={{ marginLeft: 6 }} />
            )}
          </TopicPill>
        ))}
      </ScrollContent>
    </Container>
  );
};
