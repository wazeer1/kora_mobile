import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');

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

const SaveButton = styled.TouchableOpacity`
  padding: 8px;
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;

// Avatar
const AvatarContainer = styled.View`
  align-items: center;
  margin-bottom: 32px;
`;

const HexagonAvatar = styled.View`
  width: 120px;
  height: 120px;
  background-color: #0A192F;
  border-width: 2px;
  border-color: #D4AF37;
  border-radius: 20px; /* Rough hex approximation or just rounded square for MVP */
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const AvatarImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const CameraButton = styled.TouchableOpacity`
  position: absolute;
  bottom: -10px;
  right: -10px;
  background-color: #D4AF37;
  padding: 8px;
  border-radius: 20px;
`;

// Form
const FormGroup = styled.View`
  margin-bottom: 24px;
`;

const Label = styled(ThemedText)`
  color: #B0B3B8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
`;

const Input = styled.TextInput`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  color: white;
  font-size: 16px;
  border-width: 1px;
  border-color: rgba(255,255,255,0.1);
`;

const BioInput = styled(Input)`
  height: 100px;
  text-align-vertical: top;
`;

const CharCount = styled(ThemedText)`
  text-align: right;
  font-size: 10px;
  color: #666;
  margin-top: 4px;
`;

export default function EditProfileScreen() {
    const router = useRouter();
    const [hasChanges, setHasChanges] = useState(false);

    // Mock Data
    const [displayName, setDisplayName] = useState('Wazeer Ahmed');
    const [handle, setHandle] = useState('wazeer');
    const [bio, setBio] = useState('Building the future of debating.');

    // Mock Validation
    const [isHandleChecking, setIsHandleChecking] = useState(false);

    const handleChange = (setter: any, val: string) => {
        setter(val);
        setHasChanges(true);
    };

    const handleSave = () => {
        // Here we would dispatch an updateProfile action
        Alert.alert('Success', 'Profile updated successfully.');
        setHasChanges(false);
    };

    const handleCamera = () => {
        Alert.alert('Media Picker', 'Opens native image picker.');
    };

    return (
        <Container>
            <Header>
                <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconSymbol name="chevron.left" size={20} color="#D4AF37" />
                    <ThemedText style={{ color: '#D4AF37', marginLeft: 4 }}>Back</ThemedText>
                </TouchableOpacity>
                <HeaderTitle>IDENTITY</HeaderTitle>
                <SaveButton onPress={handleSave} disabled={!hasChanges}>
                    <ThemedText style={{ color: hasChanges ? '#D4AF37' : '#666', fontWeight: 'bold' }}>SAVE</ThemedText>
                </SaveButton>
            </Header>

            <Content>
                <AvatarContainer>
                    <HexagonAvatar>
                        <AvatarImage source={{ uri: 'https://i.pravatar.cc/300?u=wazeer' }} />
                    </HexagonAvatar>
                    <CameraButton onPress={handleCamera}>
                        <IconSymbol name="camera.fill" size={16} color="black" />
                    </CameraButton>
                </AvatarContainer>

                <FormGroup>
                    <Label>Display Name</Label>
                    <Input
                        value={displayName}
                        onChangeText={(t) => handleChange(setDisplayName, t)}
                        placeholderTextColor="#444"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Handle (@)</Label>
                    <Input
                        value={handle}
                        onChangeText={(t) => handleChange(setHandle, t)}
                        autoCapitalize="none"
                        style={{ borderColor: isHandleChecking ? '#D4AF37' : 'rgba(255,255,255,0.1)' }}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Bio (Manifesto)</Label>
                    <BioInput
                        value={bio}
                        onChangeText={(t) => handleChange(setBio, t)}
                        multiline
                        maxLength={160}
                    />
                    <CharCount style={{ color: bio.length > 150 ? '#FF4444' : '#666' }}>
                        {bio.length}/160
                    </CharCount>
                </FormGroup>

                {/* Topic Tags Mock */}
                <Label>Topic Tags</Label>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    {['Tech', 'Politics', 'AI'].map(tag => (
                        <View key={tag} style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: '#D4AF37' }}>
                            <ThemedText style={{ color: '#D4AF37', fontSize: 12 }}>{tag}</ThemedText>
                        </View>
                    ))}
                    <TouchableOpacity style={{ padding: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16 }}>
                        <IconSymbol name="plus" size={16} color="white" />
                    </TouchableOpacity>
                </View>

            </Content>
        </Container>
    );
}
