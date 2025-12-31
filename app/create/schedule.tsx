import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/src/components/atoms/Button';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, TextInput } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #0A192F;
  padding: 24px;
`;

const FormInput = styled(TextInput)`
  background-color: rgba(255,255,255,0.05);
  color: white;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  margin-bottom: 24px;
`;

const DateTrigger = styled.TouchableOpacity`
    background-color: rgba(255,255,255,0.05);
    padding: 16px;
    border-radius: 12px;
    flex-direction: row;
    align-items: center;
    margin-bottom: 24px;
`;

const CoverUpload = styled.TouchableOpacity`
  height: 200px;
  background-color: rgba(255,255,255,0.05);
  border-radius: 12px;
  border-width: 1px;
  border-color: rgba(255,255,255,0.1);
  border-style: dashed;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

export default function ScheduleEventScreen() {
    const router = useRouter();

    return (
        <Container>
            <Stack.Screen options={{ title: 'Schedule Event', headerStyle: { backgroundColor: '#0A192F' }, headerTintColor: 'white' }} />

            <ScrollView>
                <ThemedText style={{ marginBottom: 8, fontWeight: 'bold' }}>Title</ThemedText>
                <FormInput placeholder="e.g. The Great crypto Debate" placeholderTextColor="gray" />

                <ThemedText style={{ marginBottom: 8, fontWeight: 'bold' }}>Date & Time</ThemedText>
                <DateTrigger>
                    <IconSymbol name="calendar" size={20} color="#D4AF37" />
                    <ThemedText style={{ marginLeft: 12 }}>Select Date...</ThemedText>
                </DateTrigger>

                <ThemedText style={{ marginBottom: 8, fontWeight: 'bold' }}>Cover Art</ThemedText>
                <CoverUpload>
                    <IconSymbol name="arrow.up.circle" size={32} color="gray" />
                    <ThemedText style={{ color: 'gray', marginTop: 8 }}>Upload 16:9 Image</ThemedText>
                </CoverUpload>
            </ScrollView>

            <Button
                label="CREATE EVENT"
                onPress={() => router.back()}
                fullWidth
                style={{ backgroundColor: '#D4AF37', marginBottom: 20 }}
                labelStyle={{ color: '#0A192F', fontWeight: 'bold' }}
            />
        </Container>
    );
}
