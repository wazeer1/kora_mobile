import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

export type NotificationType = 'draft' | 'gauntlet' | 'live' | 'verdict' | 'system';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  avatar?: string;
  metadata?: {
    eloChange?: number;
    role?: string;
    side?: string;
  };
  read: boolean;
}

interface NotificationCardProps {
  item: NotificationData;
  onPress?: () => void;
  onAction?: (action: string) => void;
}

// Bakkground Styles based on Type
const CardContainer = styled.TouchableOpacity<{ type: NotificationType }>`
  background-color: ${props => props.type === 'draft' ? '#0A192F' : props.type === 'verdict' ? 'rgba(255,255,255,0.05)' : '#0A192F'};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border-width: ${props => props.type === 'draft' ? '1px' : '0px'};
  border-color: ${props => props.type === 'draft' ? '#D4AF37' : 'transparent'};
  flex-direction: row;
  overflow: hidden;
  position: relative;
`;

const LiveBackground = styled(LinearGradient)`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  opacity: 0.2;
`;

const Avatar = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 12px;
  background-color: #333;
`;

const IconBadge = styled.View<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.color};
`;

const Content = styled.View`
  flex: 1;
`;

const TimeText = styled(ThemedText)`
  font-size: 10px;
  color: #B0B3B8;
  margin-top: 4px;
`;

const ActionsRow = styled.View`
  flex-direction: row;
  margin-top: 12px;
  gap: 8px;
`;

const ActionButton = styled.TouchableOpacity<{ variant: 'primary' | 'secondary' | 'danger' }>`
  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${props =>
    props.variant === 'primary' ? '#D4AF37' :
      props.variant === 'danger' ? '#FF6B6B' :
        'rgba(255,255,255,0.1)'
  };
  flex: 1;
  align-items: center;
`;

const ActionText = styled(ThemedText) <{ variant: 'primary' | 'secondary' | 'danger' }>`
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.variant === 'primary' ? '#0A192F' : 'white'};
`;

export const NotificationCard = ({ item, onPress, onAction }: NotificationCardProps) => {

  const renderIcon = () => {
    if (item.type === 'live') return <IconBadge color="rgba(255, 107, 107, 0.2)"><IconSymbol name="antenna.radiowaves.left.and.right" size={20} color="#FF6B6B" /></IconBadge>;
    if (item.type === 'verdict') return <IconBadge color="rgba(212, 175, 55, 0.1)"><IconSymbol name="trophy.fill" size={20} color="#D4AF37" /></IconBadge>;
    if (item.type === 'gauntlet') return <IconBadge color="rgba(255, 255, 255, 0.1)"><IconSymbol name="flame.fill" size={20} color="orange" /></IconBadge>;
    if (item.avatar) return <Avatar source={{ uri: item.avatar }} />;
    return <IconBadge color="rgba(255,255,255,0.1)"><IconSymbol name="bell.fill" size={20} color="white" /></IconBadge>;
  };

  return (
    <CardContainer type={item.type} onPress={onPress}>
      {item.type === 'live' && <LiveBackground colors={['#FF6B6B', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />}

      {renderIcon()}

      <Content>
        <ThemedText style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 2 }}>{item.title}</ThemedText>
        <ThemedText style={{ fontSize: 12, color: '#E0E0E0', lineHeight: 18 }}>{item.body}</ThemedText>

        {item.type === 'draft' && (
          <ActionsRow>
            {/* We can pass an external loading state here if needed, but for now we'll rely on the parent handler or internal state if we were refactoring fully. 
                             For this step, I'm keeping it simple and emitted events. Visual feedback can be handled in parent or by passing props. 
                             To strictly follow request, I'll assume the parent handles the visual transition or I'd need to add state here. 
                             Given the complexity guide, I'll emit the event and let the parent handle the nav. 
                             Ideally, we'd pass a 'status' prop like 'idle' | 'loading' | 'success'. 
                         */}
            <ActionButton variant="primary" onPress={() => onAction && onAction('accept')}>
              <ActionText variant="primary">Accept Role</ActionText>
            </ActionButton>
            <ActionButton variant="secondary" onPress={() => onAction && onAction('decline')}>
              <ActionText variant="secondary">Decline</ActionText>
            </ActionButton>
          </ActionsRow>
        )}

        {item.type === 'live' && (
          <ActionsRow>
            <ActionButton variant="danger" onPress={() => onAction && onAction('join')}>
              <ActionText variant="secondary">ENTER ROOM</ActionText>
            </ActionButton>
          </ActionsRow>
        )}

        {item.type === 'verdict' && (
          <ActionsRow>
            <ActionButton variant="secondary" onPress={() => onAction && onAction('view_report')}>
              <ActionText variant="secondary">View Analytics</ActionText>
            </ActionButton>
          </ActionsRow>
        )}

        <TimeText>{item.time}</TimeText>
      </Content>

      {item.type === 'draft' && <View style={{ position: 'absolute', top: 10, right: 10 }}><IconSymbol name="circle.fill" size={8} color="#D4AF37" /></View>}
    </CardContainer>
  );
};
