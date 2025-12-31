import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme as useAppTheme } from '@/src/hooks';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { ActionSheet } from './ActionSheet';

const { width } = Dimensions.get('window');
const TAB_HEIGHT = 80; // Increased height per spec
const TAB_WIDTH = width;

// Spec Colors
const PREMIUM_NAVY = '#0A192F';
const PREMIUM_GOLD = '#D4AF37';

const getPath = () => {
    const center = TAB_WIDTH / 2;
    const curveWidth = 100; // Wider curve for larger button
    const curveDepth = 45;

    return `
M0, 0 
      L${center - curveWidth / 2}, 0 
      C${center - curveWidth / 3}, 0 ${center - curveWidth / 3},${curveDepth} ${center},${curveDepth}
      C${center + curveWidth / 3},${curveDepth} ${center + curveWidth / 3}, 0 ${center + curveWidth / 2}, 0
      L${TAB_WIDTH}, 0 
      L${TAB_WIDTH},${TAB_HEIGHT}
L0, ${TAB_HEIGHT}
Z
    `;
};

const CenterButton = ({ onPress }: { onPress: () => void }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <PlatformPressable
            onPress={onPress}
            onPressIn={() => {
                scale.value = withSpring(0.9);
                if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // Thud
            }}
            onPressOut={() => scale.value = withSpring(1)}
            style={styles.centerButtonWrapper}
            onPressIn={(e) => {
                console.warn('TOUCH_DEBUG: Center Button PressIn');
                scale.value = withSpring(0.9);
                if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }}
        >
            <Animated.View style={[styles.centerButton, animatedStyle]}>
                <LinearGradient
                    colors={[PREMIUM_GOLD, '#F2D06B']}
                    style={styles.gradient}
                >
                    <IconSymbol size={28} name="mic.fill" color="white" />
                </LinearGradient>
            </Animated.View>
        </PlatformPressable>
    );
};

// Reverted to original internal state management
export function CurvedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const theme = useAppTheme();
    const [actionSheetVisible, setActionSheetVisible] = useState(false);

    const focusedOptions = descriptors[state.routes[state.index].key].options;
    if (focusedOptions.tabBarStyle?.display === 'none') {
        return null;
    }

    const visibleRoutes = state.routes.filter(route =>
        ['home', 'explore', 'create_placeholder', 'activity', 'profile'].includes(route.name)
    );

    return (
        <View
            style={styles.container}
            pointerEvents="box-none"
        >
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <Svg width={TAB_WIDTH} height={TAB_HEIGHT} style={styles.svg}>
                    <Path
                        d={getPath()}
                        fill={PREMIUM_NAVY}
                        fillOpacity={0.95}
                        stroke="rgba(212, 175, 55, 0.2)"
                        strokeWidth={0.5}
                    />
                </Svg>
            </View>

            <View style={styles.content} pointerEvents="box-none">
                {visibleRoutes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);

                    if (route.name === 'create_placeholder') {
                        return (
                            <View key="spacer" style={styles.tabItem} pointerEvents="none" />
                        );
                    }

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        const targetIndex = state.routes.findIndex(r => r.key === route.key);

                        if (state.index !== targetIndex && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const scale = useSharedValue(1);
                    React.useEffect(() => {
                        scale.value = withSpring(isFocused ? 1.1 : 1);
                    }, [isFocused]);

                    const animatedIconStyle = useAnimatedStyle(() => ({
                        transform: [{ scale: scale.value }]
                    }));

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.7}
                        >
                            <Animated.View style={[animatedIconStyle, styles.iconContainer]}>
                                {options.tabBarIcon?.({
                                    focused: isFocused,
                                    color: isFocused ? PREMIUM_GOLD : '#B0B3B8',
                                    size: 26
                                })}
                                {route.name === 'activity' && (
                                    <View style={styles.notificationDot} />
                                )}
                            </Animated.View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Floating Button rendered independently on top */}
            <View style={styles.centerButtonContainer} pointerEvents="box-none">
                <CenterButton onPress={() => setActionSheetVisible(true)} />
            </View>

            <ActionSheet
                visible={actionSheetVisible}
                onClose={() => setActionSheetVisible(false)}
                onAction={() => setActionSheetVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: TAB_HEIGHT,
        elevation: 0, // Let content handle elevation
        zIndex: 0,    // Managed by layout
        backgroundColor: 'transparent',
    },
    svg: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    content: {
        flexDirection: 'row',
        height: '100%',
        width: '100%', // Ensure full width
        alignItems: 'center',
        justifyContent: 'space-between', // Distribute items
        zIndex: 50, // Ensure content is above SVG
        elevation: 50, // Android elevation
    },
    tabItem: {
        width: TAB_WIDTH / 5, // Explicit width to prevent collapsing
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerButtonContainer: {
        position: 'absolute',
        top: -35,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center', // This centers it horizontally
        zIndex: 10,
    },
    centerButtonWrapper: {
        width: 64,
        height: 64,
        borderRadius: 32,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 10,
    },
    centerButton: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
        overflow: 'hidden',
    },
    gradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationDot: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF4757', // Red badge
        borderWidth: 1.5,
        borderColor: PREMIUM_NAVY,
    }
});
