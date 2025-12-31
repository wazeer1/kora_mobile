import { ActiveWarCard, WarCardRole } from '@/src/components/molecules/ActiveWarCard';
import React from 'react';
import { Dimensions, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

interface PriorityStackProps {
    items: Array<{
        id: string;
        role: WarCardRole;
        title: string;
        topic: string;
        status: string;
    }>;
    onPressItem: (id: string, role: string) => void;
}

export const PriorityStack = ({ items, onPressItem }: PriorityStackProps) => {

    // Sort logic: Captain > Solo > Host > Member > Roundtable > Spectator
    const sortedItems = [...items].sort((a, b) => {
        const priority: Record<string, number> = {
            'captain': 0,
            'solo': 1,
            'host': 2,
            'member': 3,
            'roundtable': 4,
            'spectator': 5
        };
        return (priority[a.role] || 99) - (priority[b.role] || 99);
    });

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            snapToInterval={width * 0.9 + 16} // Card width + margin
            decelerationRate="fast"
        >
            {sortedItems.map(item => (
                <ActiveWarCard
                    key={item.id}
                    role={item.role}
                    title={item.title}
                    topic={item.topic}
                    status={item.status}
                    onPress={() => onPressItem(item.id, item.role)}
                />
            ))}
        </ScrollView>
    );
};
