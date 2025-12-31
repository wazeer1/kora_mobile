import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, View } from 'react-native';
import styled from 'styled-components/native';

const Card = styled.TouchableOpacity`
  background-color: #112240;
  width: 120px;
  height: 140px;
  border-radius: 12px;
  padding: 12px;
  margin-right: 12px;
  justify-content: space-between;
  border-width: 1px;
  border-color: rgba(255,255,255,0.05);
`;

const Avatar = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #333;
`;

const TopicText = styled(ThemedText)`
  font-size: 11px;
  color: white;
  margin-top: 8px;
  line-height: 14px;
`;

const EloTag = styled.View`
  background-color: rgba(255,255,255,0.1);
  padding: 2px 6px;
  border-radius: 4px;
  align-self: flex-start;
  margin-bottom: 8px;
`;

export const GauntletRail = ({ items, onPressItem }: { items: any[], onPressItem: (item: any) => void }) => {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {items.map((item) => (
                <Card key={item.id} onPress={() => onPressItem(item)}>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Avatar source={{ uri: item.avatar }} />
                            <IconSymbol name="flame.fill" size={16} color="rgba(255, 165, 0, 0.5)" />
                        </View>
                        <TopicText numberOfLines={3}>{item.topic}</TopicText>
                    </View>
                    <EloTag>
                        <ThemedText style={{ fontSize: 10, color: '#B0B3B8' }}>{item.elo} Elo</ThemedText>
                    </EloTag>
                </Card>
            ))}
        </ScrollView>
    );
};
