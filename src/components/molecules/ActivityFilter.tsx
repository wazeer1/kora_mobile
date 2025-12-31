import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

export type FilterType = 'All' | 'Requests' | 'Mentions' | 'System';

interface ActivityFilterProps {
    activeFilter: FilterType;
    onSelect: (filter: FilterType) => void;
    requestCount?: number;
}

const FilterContainer = styled.View`
  padding-horizontal: 24px;
  padding-vertical: 12px;
  background-color: #0A192F;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255,255,255,0.05);
`;

const Pill = styled.TouchableOpacity<{ active: boolean }>`
  padding: 6px 16px;
  border-radius: 20px;
  background-color: ${props => props.active ? 'white' : 'rgba(255,255,255,0.1)'};
  margin-right: 8px;
  flex-direction: row;
  align-items: center;
`;

const PillText = styled(ThemedText) <{ active: boolean }>`
  color: ${props => props.active ? '#0A192F' : 'rgba(255,255,255,0.6)'};
  font-weight: 600;
  font-size: 12px;
`;

const Badge = styled.View`
  background-color: #FF6B6B;
  border-radius: 8px;
  padding-horizontal: 6px;
  height: 16px;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
`;

const BadgeText = styled(ThemedText)`
  font-size: 10px;
  font-weight: bold;
  color: white;
`;

export const ActivityFilter = ({ activeFilter, onSelect, requestCount = 0 }: ActivityFilterProps) => {
    const filters: FilterType[] = ['All', 'Requests', 'Mentions', 'System'];

    return (
        <FilterContainer>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filters.map(filter => (
                    <Pill
                        key={filter}
                        active={activeFilter === filter}
                        onPress={() => onSelect(filter)}
                    >
                        <PillText active={activeFilter === filter}>{filter}</PillText>
                        {filter === 'Requests' && requestCount > 0 && (
                            <Badge>
                                <BadgeText>{requestCount}</BadgeText>
                            </Badge>
                        )}
                    </Pill>
                ))}
            </ScrollView>
        </FilterContainer>
    );
};
