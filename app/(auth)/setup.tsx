import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLazyCheckHandleQuery } from '@/src/store/api/authApi';
import { useCompleteOnboardingMutation } from '@/src/store/api/usersApi';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, TextInput, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  background-color: #020C1B;
  padding: 20px;
  padding-top: 60px;
  align-items: center;
`;

const StepIndicator = styled.View`
  flex-direction: row;
  margin-bottom: 40px;
  gap: 8px;
`;

const StepDot = styled.View<{ active: boolean }>`
  width: ${props => props.active ? 24 : 8}px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.active ? '#D4AF37' : 'rgba(255,255,255,0.2)'};
`;

const Title = styled(ThemedText)`
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
`;

// STEP 1: HANDLE
const HandleInput = styled(TextInput)`
  font-size: 32px;
  color: #D4AF37;
  font-weight: 900;
  border-bottom-width: 2px;
  border-color: rgba(255,255,255,0.2);
  width: 80%;
  text-align: center;
  padding-bottom: 10px;
  margin-top: 40px;
`;

// STEP 2: AVATAR
const HexFrame = styled.View`
  width: 200px;
  height: 230px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: 20px;
`;

const AvatarImage = styled.Image`
  width: 200px;
  height: 200px;
`;

const UploadButton = styled.TouchableOpacity`
  margin-top: 30px;
  padding: 12px 24px;
  border-radius: 20px;
  background-color: rgba(255,255,255,0.1);
  border-width: 1px;
  border-color: #D4AF37;
`;

// STEP 3: TOPICS
const TopicsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
`;

const TopicBubble = styled.TouchableOpacity<{ selected: boolean }>`
  padding: 12px 20px;
  border-radius: 25px;
  background-color: ${props => props.selected ? '#D4AF37' : 'rgba(255,255,255,0.05)'};
  border-width: 1px;
  border-color: rgba(255,255,255,0.1);
`;

const NextButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 40px;
  width: 80%;
  height: 56px;
  border-radius: 28px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 10px;
`;

const TOPICS = ['Politics', 'Technology', 'Philosophy', 'Sports', 'Crypto', 'Art', 'History', 'Science', 'Law', 'Economics'];

// Helper to mock Topic IDs
const getTopicId = (name: string) => `topic-${name.toLowerCase()}`;

export default function SetupScreen() {
    const router = useRouter();
    const [step, setStep] = useState(1);

    // API Hooks
    const [triggerCheckHandle, { isFetching: isCheckingHandle }] = useLazyCheckHandleQuery();
    const [completeOnboarding, { isLoading: isSubmitting }] = useCompleteOnboardingMutation();

    // Step 1 State
    const [handle, setHandle] = useState('');
    const shakeX = useSharedValue(0);
    const [handleStatus, setHandleStatus] = useState<'neutral' | 'valid' | 'taken'>('neutral');

    // Step 2 State
    const [avatar, setAvatar] = useState<string | null>(null);

    // Step 3 State
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

    const shakeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shakeX.value }]
    }));

    const handleNext = async () => {
        if (step === 1) {
            if (handle.length < 3) {
                shakeX.value = withSequence(withTiming(-10, { duration: 50 }), withRepeat(withTiming(10, { duration: 50 }), 3, true), withTiming(0));
                return;
            }

            // Check availability
            try {
                const result = await triggerCheckHandle(handle).unwrap();
                if (!result.available) {
                    setHandleStatus('taken');
                    shakeX.value = withSequence(withTiming(-10, { duration: 50 }), withRepeat(withTiming(10, { duration: 50 }), 3, true), withTiming(0));
                    Alert.alert('Handle Taken', 'Please choose another handle.');
                    return;
                }
                setHandleStatus('valid');
                setStep(2);
            } catch (error) {
                Alert.alert('Error', 'Failed to check handle availability.');
            }

        } else if (step === 2) {
            if (!avatar) {
                Alert.alert('Avatar Required', 'Please upload a photo to continue.');
                return;
            }
            setStep(3);
        } else {
            if (selectedTopics.length < 3) {
                Alert.alert('Selection Required', 'Please select at least 3 battlefields.');
                return;
            }

            // FINISH
            try {
                await completeOnboarding({
                    handle,
                    avatar_url: avatar, // Note: In real app, upload first and get URL
                    topics: selectedTopics.map(getTopicId),
                    bio: ""
                }).unwrap();

                router.replace('/(tabs)/home');
            } catch (error: any) {
                Alert.alert('Error', error?.data?.message || 'Failed to complete onboarding.');
            }
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Square, we mask later
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const toggleTopic = (t: string) => {
        if (selectedTopics.includes(t)) {
            setSelectedTopics(prev => prev.filter(i => i !== t));
        } else {
            setSelectedTopics(prev => [...prev, t]);
        }
    };

    const renderContent = () => {
        switch (step) {
            case 1:
                return (
                    <Animated.View style={[{ width: '100%', alignItems: 'center' }, shakeStyle]}>
                        <Title>Claim your Identity</Title>
                        <ThemedText style={{ opacity: 0.7 }}>Choose a unique handle.</ThemedText>
                        <HandleInput
                            value={handle}
                            onChangeText={(text) => {
                                setHandle(text);
                                setHandleStatus('neutral');
                            }}
                            placeholder="@username"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            autoCapitalize="none"
                            style={{ color: handleStatus === 'taken' ? '#FF3B30' : (handleStatus === 'valid' ? '#00FF00' : '#D4AF37') }}
                        />
                        {isCheckingHandle && <ThemedText style={{ marginTop: 10 }}>Checking...</ThemedText>}
                    </Animated.View>
                );
            case 2:
                return (
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <Title>Upload Avatar</Title>
                        {/* Mock Hex Mask via Image */}
                        <HexFrame>
                            <AvatarImage
                                source={avatar ? { uri: avatar } : { uri: 'https://via.placeholder.com/200' }}
                                style={{ borderRadius: 100 }} // Circular for now, standard UI usually masks this
                            />
                            {/* Overlay Hex Border Image could go here */}
                            <View style={{ position: 'absolute', borderWidth: 5, borderColor: '#D4AF37', width: 200, height: 200, borderRadius: 100, opacity: 0.5 }} pointerEvents="none" />
                        </HexFrame>
                        <UploadButton onPress={pickImage}>
                            <ThemedText style={{ color: '#D4AF37', fontWeight: 'bold' }}>Choose Photo</ThemedText>
                        </UploadButton>
                    </View>
                );
            case 3:
                return (
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <Title>Choose your Battlefields</Title>
                        <ThemedText style={{ opacity: 0.7, marginBottom: 20 }}>Select at least 3 topics.</ThemedText>
                        <TopicsGrid>
                            {TOPICS.map(topic => (
                                <TopicBubble
                                    key={topic}
                                    selected={selectedTopics.includes(topic)}
                                    onPress={() => toggleTopic(topic)}
                                >
                                    <ThemedText style={{ color: selectedTopics.includes(topic) ? 'black' : 'white', fontWeight: 'bold' }}>
                                        {topic}
                                    </ThemedText>
                                </TopicBubble>
                            ))}
                        </TopicsGrid>
                    </View>
                );
        }
    };

    return (
        <Container>
            <StepIndicator>
                <StepDot active={step >= 1} />
                <StepDot active={step >= 2} />
                <StepDot active={step >= 3} />
            </StepIndicator>

            {renderContent()}

            <NextButton onPress={handleNext} disabled={isCheckingHandle || isSubmitting}>
                <ThemedText style={{ color: '#000', fontWeight: 'bold', fontSize: 18 }}>
                    {isSubmitting ? 'Finalizing...' : (step === 3 ? 'Finish Setup' : 'Next')}
                </ThemedText>
                <IconSymbol name="arrow.right" size={24} color="#000" />
            </NextButton>
        </Container>
    );
}
