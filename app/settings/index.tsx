import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLogoutMutation } from '@/src/store/api/authApi';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Switch, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';

const { width, height } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  background-color: rgba(2, 12, 27, 0.8); 
  justify-content: flex-end;
`;

const GlassModal = styled(BlurView)`
  width: 100%;
  height: 92%;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  overflow: hidden;
  background-color: rgba(10, 25, 47, 0.85); /* Deep Navy tint */
  padding-top: 20px;
  border-top-width: 1px;
  border-color: rgba(255, 255, 255, 0.1);
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
`;

const HeaderTitle = styled(ThemedText)`
  font-size: 20px;
  font-weight: 900;
  color: white;
  letter-spacing: 1px;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 8px;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 0 24px;
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

const GroupBlock = styled.View`
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const SettingRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255, 255, 255, 0.05);
`;

const SettingLabel = styled(ThemedText)`
  flex: 1;
  font-size: 16px;
  color: white;
  margin-left: 12px;
`;

const SettingIcon = styled(View)`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  align-items: center;
  justify-content: center;
`;

const LogoutButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 56px;
  border-radius: 28px;
  border-width: 1px;
  border-color: #FF4444;
  background-color: rgba(255, 68, 68, 0.1);
  margin-top: 40px;
  margin-bottom: 20px;
`;

export default function SettingsScreen() {
    const router = useRouter();
    const [logout, { isLoading }] = useLogoutMutation();

    // Mock states for toggles
    const [autoPlay, setAutoPlay] = useState(true);

    const handleLogout = () => {
        Alert.alert(
            "Disconnect from the Arena?",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await logout({}).unwrap();
                            // Navigate to Login and reset history prevents back button return
                            router.replace('/(auth)/login');
                        } catch (err) {
                            Alert.alert('Logout Failed', 'Please try again.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <Container>
            <GlassModal intensity={80} tint="dark">
                <Header>
                    <HeaderTitle>SYSTEM CONFIG</HeaderTitle>
                    <CloseButton onPress={() => router.back()}>
                        <ThemedText style={{ color: '#D4AF37', fontWeight: 'bold' }}>DONE</ThemedText>
                    </CloseButton>
                </Header>

                <Content>

                    {/* -- Identity -- */}
                    <SectionTitle>Account & Security</SectionTitle>
                    <GroupBlock>
                        <SettingRow onPress={() => router.push('/settings/edit-profile')}>
                            <SettingIcon>
                                <IconSymbol name="person.fill" size={16} color="white" />
                            </SettingIcon>
                            <SettingLabel>Personal Data</SettingLabel>
                            <IconSymbol name="chevron.right" size={12} color="#666" />
                        </SettingRow>
                        <SettingRow onPress={() => router.push('/settings/security')}>
                            <SettingIcon>
                                <IconSymbol name="lock.fill" size={16} color="white" />
                            </SettingIcon>
                            <SettingLabel>Login & Security</SettingLabel>
                            <IconSymbol name="chevron.right" size={12} color="#666" />
                        </SettingRow>
                        <SettingRow style={{ borderBottomWidth: 0 }} onPress={() => router.push('/settings/privacy')}>
                            <SettingIcon>
                                <IconSymbol name="eye.slash.fill" size={16} color="white" />
                            </SettingIcon>
                            <SettingLabel>Visibility</SettingLabel>
                            <IconSymbol name="chevron.right" size={12} color="#666" />
                        </SettingRow>
                    </GroupBlock>

                    {/* -- Experience -- */}
                    <SectionTitle>Arena Preferences</SectionTitle>
                    <GroupBlock>
                        <SettingRow onPress={() => router.push('/settings/preferences')}>
                            <SettingIcon>
                                <IconSymbol name="waveform" size={16} color="white" />
                            </SettingIcon>
                            <SettingLabel>Voice Processing</SettingLabel>
                            <IconSymbol name="chevron.right" size={12} color="#666" />
                        </SettingRow>
                        <SettingRow onPress={() => router.push('/settings/notifications')}>
                            <SettingIcon>
                                <IconSymbol name="bell.fill" size={16} color="white" />
                            </SettingIcon>
                            <SettingLabel>Notifications</SettingLabel>
                            <IconSymbol name="chevron.right" size={12} color="#666" />
                        </SettingRow>
                        <SettingRow style={{ borderBottomWidth: 0 }}>
                            <SettingIcon>
                                <IconSymbol name="play.fill" size={16} color="white" />
                            </SettingIcon>
                            <SettingLabel>Auto-Play Audio</SettingLabel>
                            <Switch
                                trackColor={{ false: "#767577", true: "#D4AF37" }}
                                thumbColor={autoPlay ? "#fff" : "#f4f3f4"}
                                onValueChange={setAutoPlay}
                                value={autoPlay}
                            />
                        </SettingRow>
                    </GroupBlock>

                    {/* -- Support -- */}
                    <SectionTitle>Support</SectionTitle>
                    <GroupBlock>
                        <SettingRow onPress={() => router.push('/settings/support')}>
                            <SettingIcon>
                                <IconSymbol name="questionmark.circle.fill" size={16} color="white" />
                            </SettingIcon>
                            <SettingLabel>Help Center</SettingLabel>
                            <IconSymbol name="chevron.right" size={12} color="#666" />
                        </SettingRow>
                        <SettingRow style={{ borderBottomWidth: 0 }} onPress={() => router.push('/settings/support')}>
                            <SettingIcon>
                                <IconSymbol name="doc.text.fill" size={16} color="white" />
                            </SettingIcon>
                            <SettingLabel>Community Rules</SettingLabel>
                            <IconSymbol name="chevron.right" size={12} color="#666" />
                        </SettingRow>
                    </GroupBlock>

                    {/* -- Danger Zone -- */}
                    <LogoutButton onPress={handleLogout} disabled={isLoading}>
                        <IconSymbol name="power" size={18} color="#FF4444" style={{ marginRight: 8 }} />
                        <ThemedText style={{ color: '#FF4444', fontWeight: 'bold' }}>
                            {isLoading ? 'Disconnecting...' : 'LOG OUT'}
                        </ThemedText>
                    </LogoutButton>

                    <TouchableOpacity style={{ alignItems: 'center', marginBottom: 40 }}>
                        <ThemedText style={{ color: '#666', fontSize: 12 }}>Kora v1.0.2 • Build 450</ThemedText>
                        <ThemedText style={{ color: '#FF4444', fontSize: 10, marginTop: 4, opacity: 0.5 }}>Delete Account Permanently</ThemedText>
                    </TouchableOpacity>

                </Content>
            </GlassModal>
        </Container>
    );
}
