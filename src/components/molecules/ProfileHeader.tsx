import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');

interface ProfileHeaderProps {
  name: string;
  username: string;
  avatar: string;
  banner?: string;
  rank: string; // 'Bronze' | 'Silver' | 'Gold' | 'Diamond'
  bio: string;
  isSelf?: boolean;
  onEdit?: () => void;
  onFollow?: () => void;
}

const Container = styled.View`
  background-color: #0A192F;
  margin-bottom: 16px;
`;

const BannerContainer = styled.View`
  height: 150px;
  width: ${width}px;
  position: relative;
`;

const BannerImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const AvatarContainer = styled.View`
  position: absolute;
  bottom: -40px;
  left: 24px;
  align-items: center;
`;

const RankRing = styled(LinearGradient)`
  width: 88px;
  height: 88px;
  border-radius: 44px;
  padding: 4px;
  justify-content: center;
  align-items: center;
`;

const AvatarImage = styled(Image)`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #0A192F;
  border-width: 4px;
  border-color: #0A192F;
`;

const InfoBlock = styled.View`
  margin-top: 50px;
  padding-horizontal: 24px;
`;

const BadgeRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const BadgeIcon = styled.View`
  background-color: rgba(255, 215, 0, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 6px;
  border-width: 1px;
  border-color: #D4AF37;
`;

const EditButton = styled.TouchableOpacity`
  position: absolute;
  top: 160px;
  right: 24px;
  border-width: 1px;
  border-color: #B0B3B8;
  padding: 6px 16px;
  border-radius: 20px;
`;

const getRankColors = (rank: string) => {
  switch (rank.toLowerCase()) {
    case 'diamond': return ['#B9F2FF', '#00C6FF'];
    case 'gold': return ['#FFD700', '#FDB931'];
    case 'silver': return ['#E0E0E0', '#B0B0B0'];
    default: return ['#CD7F32', '#8B4513'];
  }
};

export const ProfileHeader = ({ name, username, avatar, banner, rank, bio, isSelf, onEdit }: ProfileHeaderProps) => {
  return (
    <Container>
      <BannerContainer>
        <BannerImage source={{ uri: banner || 'https://picsum.photos/800/400' }} />
        <LinearGradient
          colors={['transparent', '#0A192F']}
          style={{ position: 'absolute', bottom: 0, height: 40, width: '100%' }}
        />
      </BannerContainer>

      <AvatarContainer>
        <RankRing colors={getRankColors(rank)} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <AvatarImage source={{ uri: avatar }} />
        </RankRing>
      </AvatarContainer>

      {isSelf && (
        <EditButton onPress={onEdit}>
          <ThemedText style={{ fontSize: 12, fontWeight: 'bold' }}>Edit Profile</ThemedText>
        </EditButton>
      )}

      <InfoBlock>
        <ThemedText type="subtitle" style={{ fontSize: 22 }}>{name}</ThemedText>
        <ThemedText style={{ color: '#B0B3B8' }}>{username}</ThemedText>

        <BadgeRow>
          <BadgeIcon><ThemedText style={{ fontSize: 10, color: '#D4AF37' }}>🛡️ Logic Guardian</ThemedText></BadgeIcon>
        </BadgeRow>

        <ThemedText style={{ marginTop: 12, color: '#E0E0E0', lineHeight: 20 }} numberOfLines={3}>
          {bio}
        </ThemedText>
      </InfoBlock>
    </Container>
  );
};
