import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/src/hooks';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const ActionsContainer = styled(Animated.View)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(10, 25, 47, 0.95);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 24px;
  padding-bottom: 40px;
  border-top-width: 1px;
  border-top-color: rgba(212, 175, 55, 0.3);
`;

const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 12px;
`;

const ActionText = styled(ThemedText)`
  font-size: 18px;
  font-weight: 600;
  margin-left: 12px;
`;

const SubText = styled(ThemedText)`
  font-size: 12px;
  color: #B0B3B8;
  margin-left: 12px;
`;

export interface ActionSheetProps {
    visible: boolean;
    onClose: () => void;
    onAction?: (action: any) => void;
}

export const ActionSheet = ({ visible, onClose, onAction }: ActionSheetProps) => {
    const { height } = useWindowDimensions();
    const translateY = useSharedValue(height);
    const router = useRouter();
    const theme = useTheme();

    // Reset animation when visibility changes
    useEffect(() => {
        if (visible) {
            translateY.value = withTiming(0, { duration: 300 });
        } else {
            translateY.value = withTiming(height, { duration: 300 });
        }
    }, [visible, height]);

    const handleClose = () => {
        translateY.value = withTiming(height, { duration: 300 }, (finished) => {
            if (finished) runOnJS(onClose)();
        });
    };

    const handleAction = (route: string) => {
        handleClose();
        if (onAction) {
            onAction(route);
        }
        // Small delay to allow modal to close before navigating
        setTimeout(() => {
            // @ts-ignore
            router.push(route);
        }, 300);
    };

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} onRequestClose={handleClose} animationType="none">
            <Pressable
                style={styles.overlay}
                onPress={handleClose}
                onTouchStart={() => console.log('TOUCH_DEBUG: Touched ActionSheet Overlay')}
            >
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            </Pressable>

            <ActionsContainer style={sheetStyle}>
                <ThemedText style={{ textAlign: 'center', marginBottom: 24, color: '#B0B3B8' }}>CREATE</ThemedText>

                <ActionButton onPress={() => handleAction('/create/arena/setup')}>
                    <IconSymbol name="antenna.radiowaves.left.and.right" size={24} color="#D4AF37" />
                    <View>
                        <ActionText>Host Live Arena</ActionText>
                        <SubText>Instant video debate setup</SubText>
                    </View>
                </ActionButton>

                <ActionButton onPress={() => handleAction('/create/schedule')}>
                    <IconSymbol name="calendar" size={24} color="#4ECDC4" />
                    <View>
                        <ActionText>Schedule Event</ActionText>
                        <SubText>Build hype for later</SubText>
                    </View>
                </ActionButton>

                <ActionButton onPress={() => handleAction('/create/post')}>
                    <IconSymbol name="pencil.and.outline" size={24} color="white" />
                    <View>
                        <ActionText>Post Argument</ActionText>
                        <SubText>Async text & tree format</SubText>
                    </View>
                </ActionButton>

            </ActionsContainer>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});
