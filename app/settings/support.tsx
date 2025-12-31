import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #020C1B; 
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #0A192F;
`;

const HeaderTitle = styled(ThemedText)`
  font-size: 18px;
  font-weight: bold;
  color: white;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;

const Card = styled.TouchableOpacity`
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: rgba(255,255,255,0.05);
  flex-direction: row;
  align-items: center;
`;

const IconBox = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255,255,255,0.05);
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;

const TextContainer = styled.View`
  flex: 1;
`;

const Title = styled(ThemedText)`
  font-size: 16px;
  font-weight: bold;
  color: white;
  margin-bottom: 4px;
`;

const Subtitle = styled(ThemedText)`
  font-size: 12px;
  color: #B0B3B8;
`;

const TosContainer = styled.View`
  padding: 20px;
  background-color: rgba(0,0,0,0.2);
  border-radius: 12px;
  margin-top: 20px;
  margin-bottom: 40px;
`;

const TosTitle = styled(ThemedText)`
  font-size: 14px;
  color: #D4AF37;
  font-weight: bold;
  margin-bottom: 8px;
`;

const TosText = styled(ThemedText)`
  font-size: 12px;
  color: #666;
  line-height: 18px;
`;

export default function SupportScreen() {
    const router = useRouter();

    const openHelp = () => {
        Alert.alert('Open Browser', 'Navigating to help.kora.app');
        // Linking.openURL('https://help.kora.app');
    };

    const reportBug = () => {
        Alert.alert('Report Bug', 'Opens bug reporting form.');
    };

    return (
        <Container>
            <Header>
                <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconSymbol name="chevron.left" size={20} color="#D4AF37" />
                    <ThemedText style={{ color: '#D4AF37', marginLeft: 4 }}>Back</ThemedText>
                </TouchableOpacity>
                <HeaderTitle>SUPPORT & LEGAL</HeaderTitle>
                <View style={{ width: 40 }} />
            </Header>

            <Content>
                <Card onPress={openHelp}>
                    <IconBox>
                        <IconSymbol name="questionmark.circle.fill" size={20} color="#4ECDC4" />
                    </IconBox>
                    <TextContainer>
                        <Title>Help Center</Title>
                        <Subtitle>Guides, FAQ, and Customer Support.</Subtitle>
                    </TextContainer>
                    <IconSymbol name="arrow.up.right" size={16} color="#666" />
                </Card>

                <Card onPress={reportBug}>
                    <IconBox>
                        <IconSymbol name="ant.fill" size={20} color="#FF6B6B" />
                    </IconBox>
                    <TextContainer>
                        <Title>Report a Bug</Title>
                        <Subtitle>Found a glitch in the matrix?</Subtitle>
                    </TextContainer>
                    <IconSymbol name="chevron.right" size={16} color="#666" />
                </Card>

                <TosContainer>
                    <TosTitle>Terms of Service</TosTitle>
                    <TosText>
                        By using Kora, you agree to abide by the Arena Rules.
                        {"\n\n"}
                        1. Respect the debate. Ad hominem attacks result in reputation loss.
                        {"\n"}
                        2. No AI-generated scripts in Live Audio rounds.
                        {"\n"}
                        3. Elo manipulation is strictly prohibited.
                        {"\n\n"}
                        Kora v1.0.2 (Build 450)
                    </TosText>
                </TosContainer>

            </Content>
        </Container>
    );
}
