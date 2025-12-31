import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMagicLinkMutation } from '@/src/store/api/authApi';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const { width, height } = Dimensions.get('window');

// --- THEME CONSTANTS ---
const COLORS = {
    NAVY_BG: '#020C1B',
    GOLD: '#D4AF37',
    GOLD_GLOW: 'rgba(212, 175, 55, 0.5)',
    GLASS_BORDER: 'rgba(255, 255, 255, 0.1)',
    GLASS_BG: 'rgba(2, 12, 27, 0.6)',
    ERROR: '#FF3B30',
    SUCCESS: '#00FF00',
    TEXT_PLACEHOLDER: '#8892b0',
};

// --- STYLED COMPONENTS ---

const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.NAVY_BG};
  justify-content: center;
  align-items: center;
`;

const BackgroundMesh = styled(Animated.View)`
  position: absolute;
  width: ${width * 1.5}px;
  height: ${width * 1.5}px;
  border-width: 1px;
  border-color: rgba(212, 175, 55, 0.05);
  transform: rotate(45deg);
  align-items: center;
  justify-content: center;
`;

const PerspectiveContainer = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const CardContainer = styled(Animated.View)`
  width: ${width - 40}px;
  backface-visibility: hidden;
  position: absolute;
`;

const GlassPanel = styled(BlurView)`
  border-radius: 20px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${props => props.borderColor || COLORS.GLASS_BORDER};
  background-color: ${COLORS.GLASS_BG};
`;

const Header = styled.View`
  align-items: center;
  margin-bottom: 24px;
`;

const HexLogo = styled.View`
  width: 40px;
  height: 40px;
  border-width: 2px;
  border-color: ${COLORS.GOLD};
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  transform: rotate(45deg);
`;

const Title = styled(ThemedText)`
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-align: center;
`;

const SubText = styled(ThemedText)`
  font-size: 14px;
  color: ${COLORS.TEXT_PLACEHOLDER};
  text-align: center;
  margin-top: 4px;
`;

// --- INPUT COMPONENT ---

const InputWrapper = styled(Animated.View)`
  margin-bottom: 16px;
  height: 56px;
  justify-content: center;
  border-width: 1px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.02);
`;

const StyledTextInput = styled(TextInput)`
  color: white;
  font-size: 16px;
  padding-horizontal: 16px;
  padding-top: 16px; 
  padding-bottom: 4px;
  height: 100%;
`;

const Label = styled(Animated.Text)`
  position: absolute;
  left: 16px;
  color: ${COLORS.TEXT_PLACEHOLDER};
  pointer-events: none;
`;

const IconWrapper = styled.View`
  position: absolute;
  right: 16px;
`;

interface CyberInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: 'default' | 'email-address' | 'numeric';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    error?: boolean;
    rightIcon?: React.ReactNode;
    inputRef?: any;
    onSubmitEditing?: () => void;
    secureTextEntry?: boolean;
}

const CyberInput = ({ label, value, onChangeText, keyboardType, autoCapitalize, error, rightIcon, inputRef, onSubmitEditing, secureTextEntry }: CyberInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const labelPos = useSharedValue(value ? 6 : 18);
    const labelSize = useSharedValue(value ? 10 : 14);
    const borderColor = useSharedValue(COLORS.GLASS_BORDER);
    const shakeX = useSharedValue(0);

    useEffect(() => {
        if (value) {
            labelPos.value = withTiming(6);
            labelSize.value = withTiming(10);
        } else if (!isFocused) {
            labelPos.value = withTiming(18);
            labelSize.value = withTiming(14);
        }
    }, [value, isFocused]);

    useEffect(() => {
        if (error) {
            borderColor.value = withTiming(COLORS.ERROR);
            shakeX.value = withSequence(withTiming(-5, { duration: 50 }), withRepeat(withTiming(5, { duration: 50 }), 3, true), withTiming(0));
        } else if (isFocused) {
            borderColor.value = withTiming(COLORS.GOLD);
        } else {
            borderColor.value = withTiming(COLORS.GLASS_BORDER);
        }
    }, [error, isFocused]);

    const animatedStyle = useAnimatedStyle(() => ({
        borderColor: borderColor.value,
        transform: [{ translateX: shakeX.value }]
    }));

    const labelStyle = useAnimatedStyle(() => ({
        top: labelPos.value,
        fontSize: labelSize.value
    }));

    return (
        <View>
            <InputWrapper style={animatedStyle}>
                <Label style={labelStyle}>{label}</Label>
                <StyledTextInput
                    ref={inputRef}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onSubmitEditing={onSubmitEditing}
                    cursorColor={COLORS.GOLD}
                    secureTextEntry={secureTextEntry}
                />
                {rightIcon && <IconWrapper>{rightIcon}</IconWrapper>}
            </InputWrapper>
        </View>
    );
};

// --- BUTTONS ---

const ActionButton = styled(TouchableOpacity)`
  height: 50px;
  border-radius: 25px;
  overflow: hidden;
  margin-top: 10px;
  shadow-color: ${COLORS.GOLD};
  shadow-opacity: 0.3;
  shadow-radius: 10px;
  elevation: 5;
`;

const GradientBackground = styled(LinearGradient)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled(ThemedText)`
  color: #000;
  font-weight: bold;
  font-size: 16px;
  letter-spacing: 1px;
`;

const SocialRow = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const SocialBtn = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: white;
  align-items: center;
  justify-content: center;
`;

const Divider = styled.View`
    flex-direction: row;
    align-items: center;
    margin-vertical: 24px;
`;
const Line = styled.View`
    flex: 1;
    height: 1px;
    background-color: rgba(255,255,255,0.1);
`;
const OrText = styled(ThemedText)`
    margin-horizontal: 10px;
    color: ${COLORS.TEXT_PLACEHOLDER};
    font-size: 12px;
`;


// --- MAIN SCREEN ---

export default function AuthScreen() {
    const router = useRouter();
    const meshRotate = useSharedValue(0);

    // API Hooks
    const [magicLink, { isLoading }] = useMagicLinkMutation();

    // State
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        meshRotate.value = withRepeat(withTiming(360, { duration: 60000, easing: Easing.linear }), -1);
    }, []);

    const meshStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${meshRotate.value}deg` }]
    }));

    const handleSubmit = async () => {
        if (!email) {
            setError(true);
            return;
        }

        try {
            await magicLink(email).unwrap();
            router.push({
                pathname: '/(auth)/verify',
                params: { email }
            });
        } catch (err: any) {
            setError(true);
            Alert.alert('Error', err?.data?.message || 'Failed to send magic link.', [{ text: 'OK' }]);
        }
    };

    return (
        <Container>
            {/* Background Hex Mesh */}
            <BackgroundMesh style={meshStyle}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <View key={i} style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderWidth: 100 + (i * 50),
                        borderColor: 'transparent',
                        borderRadius: 1000,
                        borderTopColor: 'rgba(212, 175, 55, 0.05)',
                        transform: [{ rotate: `${i * 30}deg` }]
                    }} />
                ))}
            </BackgroundMesh>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <PerspectiveContainer>
                    <CardContainer>
                        <GlassPanel intensity={40} tint="dark">
                            <View style={{ padding: 24 }}>
                                <Header>
                                    <HexLogo><View style={{ width: 10, height: 10, backgroundColor: COLORS.GOLD, transform: [{ rotate: '45deg' }] }} /></HexLogo>
                                    <Title>Enter Kora.</Title>
                                    <SubText>Sign in or create a new account instantly.</SubText>
                                </Header>

                                <CyberInput
                                    label="Email Address"
                                    value={email}
                                    onChangeText={(t) => { setEmail(t); setError(false); }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    error={error}
                                    onSubmitEditing={handleSubmit}
                                    rightIcon={<IconSymbol name="envelope" size={20} color={COLORS.TEXT_PLACEHOLDER} />}
                                />

                                <ActionButton onPress={handleSubmit} disabled={isLoading || !email} style={{ opacity: (!email) ? 0.5 : 1 }}>
                                    <GradientBackground colors={[COLORS.GOLD, '#8a701e']}>
                                        {isLoading ? <ActivityIndicator color="black" /> : <ButtonText>LOGIN / REGISTER</ButtonText>}
                                    </GradientBackground>
                                </ActionButton>

                                <SubText style={{ fontSize: 10, marginTop: 10 }}>No password required. We'll email you a magic link.</SubText>

                                <Divider>
                                    <Line />
                                    <OrText>— OR —</OrText>
                                    <Line />
                                </Divider>

                                <SocialRow>
                                    <SocialBtn><IconSymbol name="g.circle.fill" size={24} color="black" /></SocialBtn>
                                    <SocialBtn><IconSymbol name="apple.logo" size={24} color="black" /></SocialBtn>
                                </SocialRow>

                            </View>
                        </GlassPanel>
                    </CardContainer>
                </PerspectiveContainer>
            </KeyboardAvoidingView>
        </Container>
    );
}
