import { ThemedText } from '@/components/themed-text';
import { Button } from '@/src/components/atoms/Button';
import { useTheme } from '@/src/hooks';
import { BlurView } from 'expo-blur';
import React, { useEffect } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import styled from 'styled-components/native';

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
}

const ChipContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
`;

const Chip = styled.Pressable<{ active: boolean; theme: any }>`
  padding: 8px 16px;
  border-radius: 20px;
  border-width: 1px;
  border-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
`;

const ChipText = styled(ThemedText) <{ active: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.active ? '#0A192F' : props.theme.colors.text};
`;

const SectionTitle = styled(ThemedText)`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #D4AF37;
`;

const TOPICS = ['Politics', 'Tech', 'Philosophy', 'Science', 'Sports', 'Ethics', 'Economics', 'Art'];
const FORMATS = ['Live Audio Only', 'Text/Async Only', 'All'];

export const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply }) => {
    console.log('RENDER: FilterModal visible:', visible);
    const theme = useTheme();
    const { height } = useWindowDimensions();
    const translateY = useSharedValue(height);
    const [selectedTopics, setSelectedTopics] = React.useState<string[]>([]);
    const [selectedFormat, setSelectedFormat] = React.useState('All');

    useEffect(() => {
        if (visible) {
            translateY.value = withTiming(0, { duration: 300 });
        } else {
            translateY.value = withTiming(height, { duration: 300 });
        }
    }, [visible, height]);

    const toggleTopic = (topic: string) => {
        if (selectedTopics.includes(topic)) {
            setSelectedTopics(selectedTopics.filter(t => t !== topic));
        } else {
            setSelectedTopics([...selectedTopics, topic]);
        }
    };

    const handleClose = () => {
        translateY.value = withTiming(height, { duration: 300 }, (finished) => {
            if (finished) runOnJS(onClose)();
        });
    };

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }]
    }));

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} onRequestClose={handleClose}>
            <Pressable
                style={styles.overlay}
                onPress={handleClose}
                onTouchStart={() => console.log('TOUCH_DEBUG: FilterModal Overlay')}
            >
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            </Pressable>

            <Animated.View style={[styles.sheet, sheetStyle, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.indicator} />
                <ScrollView contentContainerStyle={{ padding: 24 }}>
                    <ThemedText type="title" style={{ marginBottom: 24 }}>Filter & Sort</ThemedText>

                    <SectionTitle>Topics</SectionTitle>
                    <ChipContainer>
                        {TOPICS.map(topic => (
                            <Chip
                                key={topic}
                                active={selectedTopics.includes(topic)}
                                theme={theme}
                                onPress={() => toggleTopic(topic)}
                            >
                                <ChipText active={selectedTopics.includes(topic)}>{topic}</ChipText>
                            </Chip>
                        ))}
                    </ChipContainer>

                    <SectionTitle>Format</SectionTitle>
                    <ChipContainer>
                        {FORMATS.map(format => (
                            <Chip
                                key={format}
                                active={selectedFormat === format}
                                theme={theme}
                                onPress={() => setSelectedFormat(format)}
                            >
                                <ChipText active={selectedFormat === format}>{format}</ChipText>
                            </Chip>
                        ))}
                    </ChipContainer>

                    <Button
                        label="Apply Filters"
                        onPress={() => {
                            onApply({ topics: selectedTopics, format: selectedFormat });
                            handleClose();
                        }}
                        fullWidth
                        style={{ marginTop: 20, backgroundColor: '#D4AF37' }}
                        labelStyle={{ color: '#0A192F' }}
                    />
                </ScrollView>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '60%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
    },
    indicator: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
    }
});
