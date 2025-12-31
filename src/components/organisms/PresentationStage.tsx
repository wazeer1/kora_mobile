import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import styled from 'styled-components/native';

const { width, height } = Dimensions.get('window');

interface PresentationStageProps {
    docUrl: string;
    speakers: { id: string; avatar: string; name: string; isSpeaking: boolean }[];
    onClose: () => void;
}

const Container = styled.View`
  flex: 1;
  background-color: #000;
`;

const SpeakerRail = styled.View`
  height: 80px;
  background-color: #020C1B;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 10px;
  border-bottom-width: 1px;
  border-color: rgba(255,255,255,0.1);
`;

const AvatarCircle = styled.Image<{ active: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border-width: ${props => props.active ? 3 : 1}px;
  border-color: ${props => props.active ? '#00FFFF' : 'rgba(255,255,255,0.3)'};
  margin-horizontal: 5px;
`;

const MainDocArea = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const DocImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: contain;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 90px;
  right: 20px;
  background-color: rgba(0,0,0,0.6);
  padding: 8px 12px;
  border-radius: 20px;
  z-index: 50;
`;

const SpeakerName = styled(ThemedText)`
    font-size: 8px;
    text-align: center;
    color: grey;
    margin-top: 2px;
`;

export const PresentationStage = ({ docUrl, speakers, onClose }: PresentationStageProps) => {

    return (
        <Container>
            {/* Top Speaker Rail */}
            <SpeakerRail>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
                    {speakers.map(s => (
                        <View key={s.id} style={{ alignItems: 'center' }}>
                            <AvatarCircle source={{ uri: s.avatar }} active={s.isSpeaking} />
                            <SpeakerName>{s.name}</SpeakerName>
                        </View>
                    ))}
                </ScrollView>
            </SpeakerRail>

            {/* Document View */}
            <MainDocArea>
                <DocImage source={{ uri: docUrl }} />
            </MainDocArea>

            {/* Float Close Button */}
            <CloseButton onPress={onClose}>
                <ThemedText style={{ fontWeight: 'bold' }}>Close View</ThemedText>
            </CloseButton>
        </Container>
    );
};
