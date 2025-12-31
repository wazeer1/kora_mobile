import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/src/hooks';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, TextInput } from 'react-native';
import styled from 'styled-components/native';

const HEADER_HEIGHT = Platform.OS === 'ios' ? 110 : 90;

const Container = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${HEADER_HEIGHT}px;
  z-index: 100;
  justify-content: flex-end;
  padding-bottom: 16px;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-horizontal: 16px;
  gap: 12px;
`;

const SearchBarWrapper = styled.View`
  flex: 1;
  height: 44px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 12px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.1);
`;

const SearchInput = styled(TextInput)`
  flex: 1;
  color: white;
  margin-left: 8px;
  font-size: 16px;
`;

const QRButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: rgba(212, 175, 55, 0.1);
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: rgba(212, 175, 55, 0.3);
`;

export const ExploreHeader = ({ onFocus }: { onFocus?: () => void }) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Container>
      <BlurView intensity={30} tint="dark" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      <SearchContainer>
        <SearchBarWrapper>
          <IconSymbol name="magnifyingglass" size={20} color="rgba(255,255,255,0.5)" />
          <SearchInput
            placeholder="Find topics, debaters, or rooms..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            onFocus={onFocus}
            onSubmitEditing={(e) => router.push(`/search/${e.nativeEvent.text}`)}
            returnKeyType="search"
          />
        </SearchBarWrapper>

        <QRButton>
          <IconSymbol name="qrcode" size={24} color="#D4AF37" />
        </QRButton>
      </SearchContainer>
    </Container>
  );
};
