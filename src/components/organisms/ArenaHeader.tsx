import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/src/hooks';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';

const HEADER_HEIGHT = Platform.OS === 'ios' ? 100 : 80;

const Logo = styled(Image)`
  width: 32px;
  height: 32px;
  content-fit: contain;
`;

const SegmentButton = styled.Pressable<{ active: boolean }>`
  padding: 6px 16px;
  border-radius: 20px;
  background-color: ${props => props.active ? 'rgba(212, 175, 55, 0.2)' : 'transparent'};
`;

const SegmentText = styled(ThemedText) <{ active: boolean }>`
  font-weight: 600;
  font-size: 14px;
  color: ${props => props.active ? '#D4AF37' : '#B0B3B8'};
`;

export const ArenaHeader = ({ onFilter }: { onFilter?: () => void }) => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');

    return (
        <View style={styles.container}>
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.content}>
                    {/* Left: Logo */}
                    <View style={styles.left}>
                        <Logo source={require('@/assets/images/logo.png')} />
                    </View>

                    {/* Center: Toggle */}
                    <View style={styles.center}>
                        <SegmentButton active={activeTab === 'foryou'} onPress={() => setActiveTab('foryou')}>
                            <SegmentText active={activeTab === 'foryou'}>For You</SegmentText>
                        </SegmentButton>
                        <SegmentButton active={activeTab === 'following'} onPress={() => setActiveTab('following')}>
                            <SegmentText active={activeTab === 'following'}>Following</SegmentText>
                        </SegmentButton>
                    </View>

                    {/* Right: Filter */}
                    <TouchableOpacity style={styles.right} onPress={onFilter}>
                        <IconSymbol name="line.3.horizontal.decrease" size={22} color="#D4AF37" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0),
        zIndex: 100,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 0,
    },
    left: {
        width: 40,
    },
    center: {
        flexDirection: 'row',
        gap: 8,
    },
    right: {
        width: 40,
        alignItems: 'flex-end',
    }
});
