import { ThemedText } from '@/components/themed-text';
import { useVerifyOtpMutation } from '@/src/store/api/authApi';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

const { height } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  background-color: #020C1B;
  justify-content: center;
  padding: 20px;
`;

const GlassPanel = styled(BlurView)`
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  padding: 30px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.1);
  align-items: center;
`;

const Title = styled(ThemedText)`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
`;

const Subtitle = styled(ThemedText)`
  font-size: 14px;
  opacity: 0.7;
  text-align: center;
  margin-bottom: 30px;
`;

// Input styles
const CodeInputContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 30px;
`;

const CodeBox = styled.TouchableOpacity`
  width: 45px;
  height: 55px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.2);
  align-items: center;
  justify-content: center;
`;

const CodeText = styled(ThemedText)`
  font-size: 24px;
  font-weight: bold;
  color: #D4AF37;
`;

const HiddenInput = styled.TextInput`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
`;

const VerifyButton = styled.TouchableOpacity`
  height: 56px;
  width: 100%;
  background-color: #D4AF37;
  border-radius: 28px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  shadow-opacity: 0.3;
  shadow-radius: 10px;
  shadow-color: #D4AF37;
  elevation: 5;
`;

export default function VerifyScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();
    const [otp, setOtp] = useState('');
    const inputRef = useRef<TextInput>(null);

    const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

    const handleVerify = async () => {
        if (!otp || otp.length !== 6) {
            Alert.alert('Invalid OTP', 'Please enter the complete 6-digit code.');
            return;
        }

        try {
            const result = await verifyOtp({ email, otp }).unwrap();
            const user = result?.data?.user || result?.user;

            if (user && !user.onboarding_complete) {
                router.replace('/(auth)/setup');
            } else {
                router.replace('/(tabs)/home');
            }

        } catch (err: any) {
            Alert.alert('Verification Failed', err?.data?.message || 'Invalid code.');
        }
    };

    const handlePress = () => {
        inputRef.current?.focus();
    };

    return (
        <Container>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <GlassPanel intensity={50} tint="dark">
                    <Title>Check Your Email</Title>
                    <Subtitle>We sent a 6-digit code to {email}</Subtitle>

                    <CodeInputContainer>
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <CodeBox key={index} onPress={handlePress} style={{ borderColor: otp.length === index ? '#D4AF37' : 'rgba(255,255,255,0.2)' }}>
                                <CodeText>{otp[index] || ''}</CodeText>
                            </CodeBox>
                        ))}
                    </CodeInputContainer>

                    <HiddenInput
                        ref={inputRef as any}
                        value={otp}
                        onChangeText={(text) => setOtp(text.slice(0, 6))}
                        keyboardType="number-pad"
                        maxLength={6}
                        autoFocus
                    />

                    <VerifyButton onPress={handleVerify} disabled={isLoading || otp.length !== 6} style={{ opacity: otp.length === 6 ? 1 : 0.5 }}>
                        <ThemedText style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
                            {isLoading ? 'Verifying...' : 'Verify Email'}
                        </ThemedText>
                    </VerifyButton>

                    <TouchableOpacity style={{ marginTop: 20 }} onPress={() => Alert.alert('Resend', 'Check email spam folder.')}>
                        <ThemedText style={{ color: '#B0B3B8', fontSize: 12 }}>
                            Didn't receive code? <ThemedText style={{ color: '#D4AF37', fontWeight: 'bold' }}>Resend</ThemedText>
                        </ThemedText>
                    </TouchableOpacity>

                </GlassPanel>
            </KeyboardAvoidingView>
        </Container>
    );
}
