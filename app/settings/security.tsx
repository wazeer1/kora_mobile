import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, LayoutAnimation, Platform, Switch, TouchableOpacity, UIManager, View } from 'react-native';
import styled from 'styled-components/native';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

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

const SectionTitle = styled(ThemedText)`
  font-size: 12px;
  color: #D4AF37;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 24px;
  margin-bottom: 12px;
  font-weight: bold;
`;

const Card = styled.View`
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: rgba(255,255,255,0.05);
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Label = styled(ThemedText)`
  color: #B0B3B8;
  font-size: 14px;
`;

const Value = styled(ThemedText)`
  color: white;
  font-size: 14px;
  font-weight: bold;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 6px 12px;
  border-radius: 16px;
  border-width: 1px;
  border-color: #D4AF37;
`;

const SocialRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 12px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255,255,255,0.05);
`;

// Types
type ConnectionStatus = 'connected' | 'disconnected';

export default function SecurityScreen() {
    const router = useRouter();
    const [passwordExpanded, setPasswordExpanded] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);

    const togglePassword = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setPasswordExpanded(!passwordExpanded);
    };

    return (
        <Container>
            <Header>
                <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconSymbol name="chevron.left" size={20} color="#D4AF37" />
                    <ThemedText style={{ color: '#D4AF37', marginLeft: 4 }}>Back</ThemedText>
                </TouchableOpacity>
                <HeaderTitle>SECURITY PROTOCOL</HeaderTitle>
                <View style={{ width: 40 }} />
            </Header>

            <Content>
                <SectionTitle>Credentials</SectionTitle>
                <Card>
                    <Row>
                        <Label>Email</Label>
                        <Value style={{ color: '#666' }}>user@example.com</Value>
                    </Row>
                    <TouchableOpacity onPress={() => Alert.alert('Contact Support', 'Email changes require support verification.')}>
                        <ThemedText style={{ fontSize: 10, color: '#D4AF37' }}>Request Change</ThemedText>
                    </TouchableOpacity>
                </Card>

                <Card>
                    <Row style={{ marginBottom: passwordExpanded ? 16 : 0 }}>
                        <Label>Password</Label>
                        <TouchableOpacity onPress={togglePassword}>
                            <ThemedText style={{ color: '#D4AF37', fontWeight: 'bold' }}>
                                {passwordExpanded ? 'Cancel' : 'Update'}
                            </ThemedText>
                        </TouchableOpacity>
                    </Row>

                    {passwordExpanded && (
                        <View>
                            <Label style={{ marginBottom: 8, marginTop: 8 }}>Current Password</Label>
                            <Value style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 8, overflow: 'hidden' }}>••••••••</Value>

                            <Label style={{ marginBottom: 8, marginTop: 16 }}>New Password</Label>
                            <Value style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 8, overflow: 'hidden', color: '#666' }}>Enter new password</Value>

                            <ActionButton style={{ alignSelf: 'flex-end', marginTop: 16, backgroundColor: '#D4AF37' }} onPress={togglePassword}>
                                <ThemedText style={{ color: 'black', fontWeight: 'bold' }}>Save Changes</ThemedText>
                            </ActionButton>
                        </View>
                    )}
                </Card>

                <SectionTitle>Connections</SectionTitle>
                <Card>
                    <SocialRow>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <IconSymbol name="g.circle.fill" size={24} color="white" />
                            <ThemedText style={{ color: 'white' }}>Google</ThemedText>
                        </View>
                        <ThemedText style={{ color: '#4ECDC4', fontSize: 12 }}>Connected</ThemedText>
                    </SocialRow>
                    <SocialRow>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <IconSymbol name="apple.logo" size={24} color="white" />
                            <ThemedText style={{ color: 'white' }}>Apple</ThemedText>
                        </View>
                        <TouchableOpacity>
                            <ThemedText style={{ color: '#D4AF37', fontSize: 12 }}>Connect</ThemedText>
                        </TouchableOpacity>
                    </SocialRow>
                </Card>

                <SectionTitle>2-Factor Auth (2FA)</SectionTitle>
                <Card>
                    <Row style={{ marginBottom: 0 }}>
                        <View>
                            <Label style={{ color: 'white', fontWeight: 'bold' }}>Authenticator App</Label>
                            <Label style={{ fontSize: 10, marginTop: 4 }}>Google Auth / Authy</Label>
                        </View>
                        <Switch
                            value={twoFactor}
                            onValueChange={(val) => {
                                if (val) Alert.alert('Setup 2FA', 'QR Code Mock would open here.');
                                setTwoFactor(val);
                            }}
                            trackColor={{ false: "#767577", true: "#D4AF37" }}
                        />
                    </Row>
                </Card>

            </Content>
        </Container>
    );
}
