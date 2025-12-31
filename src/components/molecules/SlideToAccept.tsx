import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';

interface SliderProps {
    onComplete: () => void;
    text?: string;
}

const BUTTON_WIDTH = 60;
const CONTAINER_HEIGHT = 70;
const { width } = Dimensions.get('window');
const PADDING = 20;
const SLIDER_WIDTH = width - (PADDING * 2) - 48; // Adjust based on modal padding

export const SlideToAccept = ({ onComplete, text = "Slide to Accept" }: SliderProps) => {
    const pan = React.useRef(new Animated.ValueXY()).current;

    // Limit translation from 0 to MAX_WIDTH
    const MAX_WIDTH = SLIDER_WIDTH - BUTTON_WIDTH - 8; // 8 for padding

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                const newX = gestureState.dx;
                if (newX >= 0 && newX <= MAX_WIDTH) {
                    pan.setValue({ x: newX, y: 0 });
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx > MAX_WIDTH * 0.8) {
                    // Completed
                    Animated.spring(pan, {
                        toValue: { x: MAX_WIDTH, y: 0 },
                        useNativeDriver: false
                    }).start(onComplete);
                } else {
                    // Reset
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false
                    }).start();
                }
            }
        })
    ).current;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
            <Animated.View
                style={[
                    styles.button,
                    {
                        transform: [{ translateX: pan.x }]
                    }
                ]}
                {...panResponder.panHandlers}
            >
                <IconSymbol name="chevron.right.2" size={24} color="#0A192F" />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: CONTAINER_HEIGHT,
        backgroundColor: '#112240',
        borderRadius: 35,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        padding: 4,
        position: 'relative',
        width: '100%',
    },
    text: {
        textAlign: 'center',
        color: '#D4AF37',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
        position: 'absolute',
        width: '100%',
    },
    button: {
        width: BUTTON_WIDTH,
        height: BUTTON_WIDTH,
        borderRadius: BUTTON_WIDTH / 2,
        backgroundColor: '#D4AF37',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
