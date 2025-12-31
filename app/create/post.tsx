import { ThemedText } from '@/components/themed-text';
import { Button } from '@/src/components/atoms/Button';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #0A192F;
  padding: 24px;
`;

const TitleInput = styled(TextInput)`
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-bottom: 24px;
`;

const BodyInput = styled(TextInput)`
  font-size: 16px;
  color: white;
  min-height: 200px;
  margin-bottom: 24px;
  text-align-vertical: top;
`;

const StanceSelector = styled.View`
  flex-direction: row;
  background-color: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
`;

const StanceOption = styled.TouchableOpacity<{ active: boolean; color: string }>`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  background-color: ${props => props.active ? props.color : 'transparent'};
  align-items: center;
`;

const StanceText = styled(ThemedText) <{ active: boolean }>`
  font-weight: bold;
  opacity: ${props => props.active ? 1 : 0.5};
`;

export default function PostArgumentScreen() {
    const router = useRouter();
    const [stance, setStance] = useState<'pro' | 'con' | 'neutral'>('neutral');

    return (
        <Container>
            <Stack.Screen options={{ title: 'Draft Argument', headerStyle: { backgroundColor: '#0A192F' }, headerTintColor: 'white' }} />

            <ScrollView>
                <TitleInput
                    placeholder="The Premise (Title)"
                    placeholderTextColor="gray"
                    multiline
                />

                <StanceSelector>
                    <StanceOption
                        active={stance === 'pro'}
                        color="#4ECDC4"
                        onPress={() => setStance('pro')}
                    >
                        <StanceText active={stance === 'pro'}>PRO</StanceText>
                    </StanceOption>
                    <StanceOption
                        active={stance === 'neutral'}
                        color="gray"
                        onPress={() => setStance('neutral')}
                    >
                        <StanceText active={stance === 'neutral'}>NEUTRAL</StanceText>
                    </StanceOption>
                    <StanceOption
                        active={stance === 'con'}
                        color="#FF6B6B"
                        onPress={() => setStance('con')}
                    >
                        <StanceText active={stance === 'con'}>CON</StanceText>
                    </StanceOption>
                </StanceSelector>

                <BodyInput
                    placeholder="The Context (Body)..."
                    placeholderTextColor="gray"
                    multiline
                />
            </ScrollView>

            <Button
                label="POST ARGUMENT"
                onPress={() => router.back()}
                fullWidth
                style={{ backgroundColor: '#D4AF37', marginBottom: 20 }}
                labelStyle={{ color: '#0A192F', fontWeight: 'bold' }}
            />
        </Container>
    );
}
