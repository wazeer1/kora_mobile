import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { StyleSheet } from 'react-native';

export default function LiveScreen() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Live Arena</ThemedText>
            <ThemedText>Active debate room interaction.</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
