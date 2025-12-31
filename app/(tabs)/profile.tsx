import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/src/components/atoms/Button';
import { CareerCard } from '@/src/components/molecules/CareerCard';
import { ProfileHeader } from '@/src/components/molecules/ProfileHeader';
import { useUploadImageMutation } from '@/src/store/api/uploadApi';
import { useGetMyProfileQuery, useUpdateUserProfileMutation } from '@/src/store/api/usersApi';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #0A192F;
`;

const StatsRow = styled.View`
  flex-direction: row;
  padding: 16px 24px;
  justify-content: space-between;
  margin-top: 8px;
`;

const StatItem = styled.View`
  align-items: center;
`;

const StatValue = styled(ThemedText)`
  font-size: 20px;
  font-weight: bold;
  color: white;
`;

const StatLabel = styled(ThemedText)`
  font-size: 10px;
  color: #B0B3B8;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 4px;
`;

const StickyTabBar = styled.View`
  flex-direction: row;
  background-color: #0A192F;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255,255,255,0.1);
  padding-horizontal: 24px;
`;

const Tab = styled.TouchableOpacity<{ active: boolean }>`
  padding-vertical: 16px;
  margin-right: 24px;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.active ? '#D4AF37' : 'transparent'};
`;

const TabText = styled(ThemedText) <{ active: boolean }>`
  color: ${props => props.active ? '#D4AF37' : '#B0B3B8'};
  font-weight: bold;
  font-size: 14px;
`;

const ContentContainer = styled.View`
  padding: 24px;
  padding-bottom: 100px;
`;

const Footer = styled.View`
  padding: 16px 24px;
  background-color: #0A192F;
  border-top-width: 1px;
  border-top-color: rgba(255,255,255,0.1);
  position: absolute;
  bottom: 0; left: 0; right: 0;
`;

// -- Edit Modal Styles --
const ModalOverlay = styled.View`
    flex: 1;
    background-color: rgba(0,0,0,0.8);
    justify-content: center;
    padding: 20px;
`;
const ModalContent = styled.View`
    background-color: #112240;
    padding: 24px;
    border-radius: 12px;
    border-width: 1px;
    border-color: #D4AF37;
`;
const EditInput = styled.TextInput`
    background-color: rgba(255,255,255,0.05);
    color: white;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 16px;
    border-width: 1px;
    border-color: rgba(255,255,255,0.1);
`;
const ModalTitle = styled(ThemedText)`
    font-size: 20px;
    font-weight: bold;
    color: #D4AF37;
    margin-bottom: 20px;
    text-align: center;
`;
const ButtonRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
`;

export default function ProfileScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Career');
    const [isSelf, setIsSelf] = useState(true);

    const { data: userProfile, isLoading } = useGetMyProfileQuery(undefined);
    const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

    const [uploadImage, { isLoading: isUploadingImage }] = useUploadImageMutation();

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        handle: '',
        avatarUrl: '',
        coverUrl: ''
    });

    const handleImagePick = async (field: 'avatarUrl' | 'coverUrl') => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: field === 'avatarUrl' ? [1, 1] : [2, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                const asset = result.assets[0];

                // Prepare FormData
                const formData = new FormData();
                formData.append('file', {
                    uri: asset.uri,
                    name: asset.fileName || `upload_${Date.now()}.jpg`,
                    type: asset.mimeType || 'image/jpeg',
                } as any);

                // Upload immediately
                const response = await uploadImage(formData).unwrap();

                // Update local form state with new remote URL
                setEditForm(prev => ({
                    ...prev,
                    [field]: response.data.url
                }));
            }
        } catch (error) {
            Alert.alert('Upload Failed', 'Could not upload image.');
        }
    };


    const initEdit = () => {
        if (userProfile) {
            setEditForm({
                firstName: userProfile.first_name || '',
                lastName: userProfile.last_name || '',
                bio: userProfile.bio || '',
                handle: userProfile.handle || '',
                avatarUrl: userProfile.avatar_url || '',
                coverUrl: userProfile.cover_url || ''
            });
            setIsEditing(true);
        }
    };

    const handleSave = async () => {
        try {
            await updateUserProfile({
                firstName: editForm.firstName,
                lastName: editForm.lastName,
                bio: editForm.bio,
                avatar_url: editForm.avatarUrl,
                cover_url: editForm.coverUrl
            }).unwrap();
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated.');
        } catch (err: any) {
            Alert.alert('Error', err?.data?.message || 'Failed to update profile.');
        }
    };

    const winRate = userProfile ?
        ((userProfile.wins || 0) / ((userProfile.wins || 0) + (userProfile.losses || 0) || 1) * 100).toFixed(0) + '%'
        : '-%';

    const MOCK_HISTORY = [
        { id: '1', title: 'Is AI Sentient?', result: 'win', role: 'Captain', date: '2d ago' },
        { id: '2', title: 'The Future of Crypto', result: 'loss', role: 'Member', date: '1w ago' },
        { id: '3', title: 'UBI vs Welfare', result: 'draw', role: 'SOLO', date: '2w ago' },
    ];

    if (isLoading) {
        return (
            <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#D4AF37" />
            </Container>
        );
    }

    return (
        <Container>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: userProfile?.handle || 'Profile',
                    headerTransparent: false,
                    headerStyle: { backgroundColor: '#0A192F' },
                    headerTintColor: 'white',
                    headerRight: () => (
                        <TouchableOpacity onPress={() => router.push('/settings')}>
                            <IconSymbol name="gear" size={24} color="white" style={{ marginRight: 16 }} />
                        </TouchableOpacity>
                    )
                }}
            />

            <ScrollView stickyHeaderIndices={[2]}>

                {/* 0. Header */}
                <ProfileHeader
                    name={userProfile?.first_name ? `${userProfile.first_name} ${userProfile.last_name || ''}` : (userProfile?.handle || 'Unknown')}
                    username={`@${userProfile?.handle || ''}`}
                    rank={userProfile?.tier || "Gold"}
                    avatar={userProfile?.avatar_url || "https://i.pravatar.cc/300?u=wazeer"}
                    banner={userProfile?.cover_url || "https://picsum.photos/800/400"}
                    bio={userProfile?.bio || "No bio yet."}
                    isSelf={isSelf}
                    onEdit={initEdit}
                />

                {/* 1. Stats */}
                <StatsRow>
                    <StatItem>
                        <StatValue style={{ color: '#4ECDC4' }}>{userProfile?.elo || 1200}</StatValue>
                        <StatLabel>Elo Rating</StatLabel>
                    </StatItem>
                    <StatItem>
                        <StatValue>{winRate}</StatValue>
                        <StatLabel>Win Rate</StatLabel>
                    </StatItem>
                    <StatItem>
                        <StatValue style={{ color: '#D4AF37' }}>{userProfile?.reputation || 0}</StatValue>
                        <StatLabel>Reputation</StatLabel>
                    </StatItem>
                </StatsRow>

                {/* 2. Sticky Tab Bar */}
                <StickyTabBar>
                    {['Career', 'Stance', 'Clips', 'About'].map(tab => (
                        <Tab key={tab} active={activeTab === tab} onPress={() => setActiveTab(tab)}>
                            <TabText active={activeTab === tab}>{tab}</TabText>
                        </Tab>
                    ))}
                </StickyTabBar>

                {/* 3. Content */}
                <ContentContainer>
                    {activeTab === 'Career' && (
                        <>
                            {MOCK_HISTORY.map((item: any) => (
                                <CareerCard
                                    key={item.id}
                                    title={item.title}
                                    result={item.result}
                                    role={item.role}
                                    date={item.date}
                                    onPress={() => { }}
                                />
                            ))}
                            {isSelf && (
                                <Button
                                    label="Start New Debate"
                                    variant="outline"
                                    onPress={() => router.push('/create/arena/setup')}
                                    style={{ marginTop: 20 }}
                                />
                            )}
                        </>
                    )}
                    {activeTab === 'Stance' && (
                        <ThemedText style={{ color: '#B0B3B8', textAlign: 'center', marginTop: 40 }}>
                            No stance papers published yet.
                        </ThemedText>
                    )}
                    {activeTab === 'About' && (
                        <ThemedText style={{ color: 'white' }}>{userProfile?.bio || "User has not written a bio."}</ThemedText>
                    )}
                </ContentContainer>

            </ScrollView>

            {/* Editing Modal */}
            <Modal visible={isEditing} transparent animationType="fade">
                <ModalOverlay>
                    <ModalContent>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <ModalTitle>Edit Profile</ModalTitle>
                            <EditInput
                                placeholder="First Name"
                                placeholderTextColor="#666"
                                value={editForm.firstName}
                                onChangeText={t => setEditForm({ ...editForm, firstName: t })}
                            />
                            <EditInput
                                placeholder="Last Name"
                                placeholderTextColor="#666"
                                value={editForm.lastName}
                                onChangeText={t => setEditForm({ ...editForm, lastName: t })}
                            />
                            <ThemedText style={{ color: '#B0B3B8', marginBottom: 8 }}>Tap images to edit</ThemedText>

                            {/* Cover Image Picker */}
                            <TouchableOpacity onPress={() => handleImagePick('coverUrl')} style={{ marginBottom: 16 }}>
                                <Image
                                    source={{ uri: editForm.coverUrl || 'https://picsum.photos/800/400' }}
                                    style={{ width: '100%', height: 120, borderRadius: 8, opacity: 0.8 }}
                                />
                                <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -12 }, { translateY: -12 }] }}>
                                    <IconSymbol name="camera.fill" size={24} color="white" />
                                </View>
                            </TouchableOpacity>

                            {/* Avatar Picker */}
                            <View style={{ alignItems: 'center', marginTop: -50, marginBottom: 20 }}>
                                <TouchableOpacity onPress={() => handleImagePick('avatarUrl')}>
                                    <Image
                                        source={{ uri: editForm.avatarUrl || 'https://i.pravatar.cc/300' }}
                                        style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#112240' }}
                                    />
                                    <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#D4AF37', borderRadius: 12, padding: 4 }}>
                                        <IconSymbol name="pencil" size={12} color="black" />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <EditInput
                                placeholder="Bio"
                                placeholderTextColor="#666"
                                value={editForm.bio}
                                onChangeText={t => setEditForm({ ...editForm, bio: t })}
                                multiline
                                numberOfLines={3}
                                style={{ height: 80, textAlignVertical: 'top' }}
                            />
                            <ButtonRow>
                                <Button label="Cancel" onPress={() => setIsEditing(false)} variant="outline" style={{ flex: 1 }} />
                                <Button
                                    label={(isUpdating || isUploadingImage) ? "Saving..." : "Save"}
                                    onPress={handleSave}
                                    disabled={isUpdating || isUploadingImage}
                                    style={{ flex: 1, backgroundColor: '#D4AF37', opacity: (isUpdating || isUploadingImage) ? 0.6 : 1 }}
                                />
                            </ButtonRow>
                        </ScrollView>
                    </ModalContent>
                </ModalOverlay>
            </Modal>

            {/* Footer Action (Visitor Only) */}
            {!isSelf && (
                <Footer>
                    <Button
                        label="THROW GAUNTLET (CHALLENGE)"
                        fullWidth
                        style={{ backgroundColor: '#D4AF37' }}
                        labelStyle={{ color: '#0A192F', fontWeight: 'bold' }}
                        onPress={() => Alert.alert('Challenge Sent!')}
                    />
                </Footer>
            )}

            {/* Dev Controls: Check VISITOR view */}
            <View style={{ position: 'absolute', top: 100, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 8 }}>
                <ThemedText style={{ fontSize: 8, color: 'white' }} onPress={() => setIsSelf(!isSelf)}>
                    DEV: TOGGLE VIEW ({isSelf ? 'SELF' : 'VISITOR'})
                </ThemedText>
            </View>

        </Container>
    );
}
