import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/src/hooks';
import { Theme } from '@/src/theme';
import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';


import styled from 'styled-components/native';

interface LiveEventCardProps {
  title: string;
  hostName: string;
  hostAvatar: string;
  viewers: number;
  format: string;
}

const CardContainer = styled.Pressable<{ theme: Theme }>`
  width: 280px;
  height: 160px;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
  margin-right: ${props => props.theme.spacing.md}px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const Content = styled.View<{ theme: Theme }>`
  padding: ${props => props.theme.spacing.md}px;
  flex: 1;
  justify-content: space-between;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const LiveBadge = styled.View<{ theme: Theme }>`
  background-color: ${props => props.theme.colors.error};
  padding: 4px 8px;
  border-radius: 4px;
`;

const LiveText = styled.Text`
  color: white;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
`;

const HostInfo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const Avatar = styled(Image)`
  width: 24px;
  height: 24px;
  border-radius: 12px;
`;

export const LiveEventCard: React.FC<LiveEventCardProps> = ({
  title,
  hostName,
  hostAvatar,
  viewers,
  format
}) => {
  const theme = useTheme();

  return (
    <CardContainer theme={theme}>
      <Content theme={theme}>
        <Header>
          <LiveBadge theme={theme}>
            <LiveText>LIVE • {viewers}</LiveText>
          </LiveBadge>
          <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>{format}</ThemedText>
        </Header>

        <View>
          <ThemedText type="subtitle" numberOfLines={2} style={{ marginBottom: 8 }}>
            {title}
          </ThemedText>
          <HostInfo>
            <Avatar source={{ uri: hostAvatar }} />
            <ThemedText style={{ fontSize: 12 }}>{hostName}</ThemedText>
          </HostInfo>
        </View>
      </Content>
    </CardContainer>
  );
};
