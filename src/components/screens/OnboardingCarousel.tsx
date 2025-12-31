import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, TouchableOpacity, View } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const { width, height } = Dimensions.get('window');

interface SlideData {
    id: string;
    title: string;
    subtext: string;
    visual: React.ReactNode;
    bg: string[];
}

const slides: SlideData[] = [
    {
        id: '1',
        title: 'Debate is a Sport.',
        subtext: 'Join structured 1v1, Team, or Roundtable battles. No chaos, just logic.',
        visual: <IconSymbol name="hexagon.fill" size={120} color="#00FFFF" />,
        bg: ['#020C1B', '#0A192F']
    },
    {
        id: '2',
        title: 'Lead Your Team.',
        subtext: 'Draft friends, strategize in private chats, and control the microphone as Captain.',
        visual: <IconSymbol name="person.3.fill" size={120} color="#FFD700" />,
        bg: ['#020C1B', '#112240']
    },
    {
        id: '3',
        title: 'Gamify Truth.',
        subtext: 'Win via audience votes or AI analysis. Earn Elo and climb the global ranks.',
        visual: <IconSymbol name="chart.line.uptrend.xyaxis" size={120} color="#FF0055" />,
        bg: ['#020C1B', '#1A0B1A']
    }
];

const Container = styled.View`
  flex: 1;
  background-color: #020C1B;
`;

const SlideContainer = styled.View`
  width: ${width}px;
  height: ${height}px;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const BottomSheet = styled(BlurView)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 35%;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  overflow: hidden;
  padding: 30px;
  justify-content: space-between;
`;

const ActionButton = styled(TouchableOpacity) <{ isFinal: boolean }>`
  height: 60px;
  background-color: ${props => props.isFinal ? '#D4AF37' : 'rgba(255,255,255,0.1)'};
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 10px;
  margin-top: 20px;
  border-width: 1px;
  border-color: ${props => props.isFinal ? '#D4AF37' : 'rgba(255,255,255,0.2)'};
`;

interface OnboardingCarouselProps {
    onFinish: () => void;
}

// Separate component to handle per-item hooks
const OnboardingSlide = ({ item, index, scrollX }: { item: SlideData, index: number, scrollX: SharedValue<number> }) => {
    const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
    ];

    const visualStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            scrollX.value,
            inputRange,
            [-width * 0.5, 0, width * 0.5],
            Extrapolation.CLAMP
        );
        const scale = interpolate(
            scrollX.value,
            inputRange,
            [0.5, 1, 0.5],
            Extrapolation.CLAMP
        );
        return {
            transform: [{ translateX }, { scale }]
        };
    });

    return (
        <SlideContainer>
            <Animated.View style={[{ marginBottom: 100 }, visualStyle]}>
                <LinearGradient
                    colors={['rgba(255,255,255,0.1)', 'transparent']}
                    style={{ padding: 40, borderRadius: 100 }}
                >
                    {item.visual}
                </LinearGradient>
            </Animated.View>
        </SlideContainer>
    );
};

export const OnboardingCarousel = ({ onFinish }: OnboardingCarouselProps) => {
    const scrollX = useSharedValue(0);
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const onScroll = useAnimatedScrollHandler(event => {
        scrollX.value = event.contentOffset.x;
    });

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
            setCurrentIndex(currentIndex + 1);
        } else {
            onFinish();
        }
    };

    return (
        <Container>
            <Animated.FlatList
                ref={flatListRef}
                data={slides}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => <OnboardingSlide item={item} index={index} scrollX={scrollX} />}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                onMomentumScrollEnd={(ev) => {
                    const idx = Math.round(ev.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(idx);
                }}
            />

            <BottomSheet intensity={80} tint="dark">
                <View>
                    <ThemedText style={{ fontSize: 32, fontWeight: '900', color: '#fff', marginBottom: 10 }}>
                        {slides[currentIndex].title}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 24 }}>
                        {slides[currentIndex].subtext}
                    </ThemedText>
                </View>

                {/* Progress Indicators */}
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 20 }}>
                    {slides.map((_, i) => (
                        <View
                            key={i}
                            style={{
                                width: i === currentIndex ? 24 : 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: i === currentIndex ? '#D4AF37' : 'rgba(255,255,255,0.2)'
                            }}
                        />
                    ))}
                </View>

                <ActionButton
                    isFinal={currentIndex === slides.length - 1}
                    onPress={handleNext}
                >
                    <ThemedText style={{
                        color: currentIndex === slides.length - 1 ? '#000' : '#fff',
                        fontWeight: 'bold',
                        fontSize: 16
                    }}>
                        {currentIndex === slides.length - 1 ? 'ENTER KORA' : 'NEXT'}
                    </ThemedText>
                    <IconSymbol
                        name={currentIndex === slides.length - 1 ? "door.right.hand.open" : "arrow.right"}
                        size={20}
                        color={currentIndex === slides.length - 1 ? '#000' : '#fff'}
                    />
                </ActionButton>
            </BottomSheet>
        </Container>
    );
};
