import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import React from 'react';
import styled from 'styled-components/native';

interface User {
    name: string;
    avatar?: string;
}

interface LobbySlotProps {
    user: User | null;
    role: 'leader' | 'member';
    status: 'empty' | 'pending' | 'filled' | 'locked';
    isSelf?: boolean;
    onPress?: () => void;
    side: 'blue' | 'red';
}

const SlotContainer = styled.TouchableOpacity`
  align-items: center;
  margin-bottom: 24px;
  width: 80px;
`;

const AvatarRing = styled.View<{ status: string, side: string }>`
  width: ${props => props.status === 'empty' ? '50px' : '60px'};
  height: ${props => props.status === 'empty' ? '50px' : '60px'};
  border-radius: 30px;
  border-width: 2px;
  border-color: ${props =>
        props.status === 'locked' ? 'rgba(255,255,255,0.1)' :
            props.status === 'empty' ? 'rgba(255,255,255,0.3)' :
                props.status === 'pending' ? 'gray' :
                    '#D4AF37'
    };
  border-style: ${props => props.status === 'empty' ? 'dashed' : 'solid'};
  align-items: center;
  justify-content: center;
  background-color: ${props => props.status === 'locked' ? 'rgba(0,0,0,0.2)' : 'transparent'};
  margin-bottom: 8px;
  position: relative;
`;

const AvatarImage = styled(Image) <{ isPending: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: 30px;
  opacity: ${props => props.isPending ? 0.5 : 1};
`;

const CrownBadge = styled.View`
  position: absolute;
  top: -10px;
  background-color: #0A192F;
  border-radius: 10px;
  padding: 2px;
`;

const StatusIcon = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #0A192F;
  border-radius: 10px;
`;

export const LobbySlot = ({ user, role, status, isSelf, onPress, side }: LobbySlotProps) => {

    return (
        <SlotContainer onPress={status === 'locked' ? undefined : onPress} disabled={status === 'locked'}>
            <AvatarRing status={status} side={side}>
                {status === 'empty' && <IconSymbol name="plus" size={20} color="gray" />}
                {status === 'locked' && <IconSymbol name="lock.fill" size={16} color="rgba(255,255,255,0.2)" />}

                {(status === 'filled' || status === 'pending') && user && (
                    <AvatarImage source={{ uri: user.avatar || 'https://i.pravatar.cc/100' }} isPending={status === 'pending'} />
                )}

                {role === 'leader' && (status === 'filled' || status === 'pending') && (
                    <CrownBadge>
                        <IconSymbol name="circle" size={12} color="#D4AF37" />
                        {/* Using circle as placeholder crown if 'crown' not avail, but crown is ideal. Emoji works too 👑 */}
                    </CrownBadge>
                )}

                {status === 'pending' && (
                    <StatusIcon>
                        <IconSymbol name="clock.arrow.circlepath" size={16} color="orange" />
                    </StatusIcon>
                )}
            </AvatarRing>

            <ThemedText style={{
                fontSize: 10,
                fontWeight: isSelf ? 'bold' : 'normal',
                color: isSelf ? '#4ECDC4' : 'white',
                textAlign: 'center'
            }}>
                {status === 'empty' ? 'Open' : status === 'locked' ? 'Waiting' : user?.name}
            </ThemedText>
        </SlotContainer>
    );
};
