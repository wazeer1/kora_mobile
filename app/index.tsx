import { BrandingScreen } from '@/src/components/screens/BrandingScreen';
import { OnboardingCarousel } from '@/src/components/screens/OnboardingCarousel';
import { selectIsAuthenticated } from '@/src/store/slices/authSlice';
import { Redirect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function EntryScreen() {
    const router = useRouter();
    const [step, setStep] = useState<'splash' | 'onboarding' | 'ready'>('splash');
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false); // TODO: Persist this

    // Check if user is already authenticated
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            // slightly delay to ensure navigation is ready or just replace
            router.replace('/(tabs)');
        }
    }, [isAuthenticated]);

    const handleSplashFinish = () => {
        if (isAuthenticated) {
            router.replace('/(tabs)');
            return;
        }

        // Here we would check async storage
        if (!hasSeenOnboarding) {
            setStep('onboarding');
        } else {
            setStep('ready');
        }
    };

    const handleOnboardingFinish = () => {
        setHasSeenOnboarding(true);
        // Navigate to login
        router.replace('/(auth)/login');
    };

    if (step === 'splash') {
        return <BrandingScreen onFinish={handleSplashFinish} />;
    }

    if (step === 'onboarding') {
        return <OnboardingCarousel onFinish={handleOnboardingFinish} />;
    }

    // Default redirect if somehow falls through or skipped
    return <Redirect href="/(auth)/login" />;
}
