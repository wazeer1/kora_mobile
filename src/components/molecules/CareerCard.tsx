import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import React from 'react';
import styled from 'styled-components/native';

interface CareerCardProps {
    title: string;
    result: 'win' | 'loss' | 'draw' | 'pending';
    role: string;
    date: string;
    onPress?: () => void;
    thumbnail?: string;
}

const Card = styled.TouchableOpacity<{ result: string }>`
  flex-direction: row;
  background-color: #0A192F;
  border-left-width: 4px;
  border-left-color: ${props =>
        props.result === 'win' ? '#D4AF37' :
            props.result === 'loss' ? '#333' :
                '#4ECDC4'
    };
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
  height: 80px;
  border-width: 1px;
  border-color: rgba(255,255,255,0.05);
`;

const Thumb = styled(Image)`
  width: 80px;
  height: 100%;
  background-color: #112240;
`;

const Content = styled.View`
  flex: 1;
  padding: 12px;
  justify-content: center;
`;

const Badge = styled.View<{ result: string }>`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: ${props =>
        props.result === 'win' ? 'rgba(212, 175, 55, 0.2)' :
            props.result === 'loss' ? 'rgba(255,255,255,0.1)' :
                'rgba(78, 205, 196, 0.1)'
    };
`;

const BadgeText = styled(ThemedText) <{ result: string }>`
  font-size: 10px;
  font-weight: bold;
  color: ${props =>
        props.result === 'win' ? '#D4AF37' :
            props.result === 'loss' ? '#B0B3B8' :
                '#4ECDC4'
    };
  text-transform: uppercase;
`;

export const CareerCard = ({ title, result, role, date, onPress, thumbnail }: CareerCardProps) => {
    return (
        <Card result={result} onPress={onPress}>
            <Thumb source={{ uri: thumbnail || 'https://picsum.photos/200' }} />
            <Content>
                <ThemedText numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 4, paddingRight: 60 }}>
                    {title}
                </ThemedText>
                <ThemedText style={{ fontSize: 12, color: '#B0B3B8' }}>{role} • {date}</ThemedText>
            </Content>
            <Badge result={result}>
                <BadgeText result={result}>{result}</BadgeText>
            </Badge>
        </Card>
    );
};
