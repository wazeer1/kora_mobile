import { ThemedText } from '@/components/themed-text';
import { Button } from '@/src/components/atoms/Button';
import { useTheme } from '@/src/hooks';
import { Theme } from '@/src/theme';
import { Image } from 'expo-image';
import React from 'react';
import styled from 'styled-components/native';

interface DebateCardProps {
    title: string;
    participants: Array<{ name: string; avatar: string }>;
    format: string;
    status: 'live' | 'upcoming' | 'replay';
    audienceCount?: number;
    timeInfo: string;
}

const CardContainer = styled.Pressable<{ theme: Theme }>`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Badge = styled.View<{ theme: Theme }>`
  background-color: ${props => props.theme.colors.secondary};
  padding: 4px 8px;
  border-radius: 4px;
`;

const ParticipantsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
  gap: -10px; 
`;

const ParticipantAvatar = styled(Image)`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  border-width: 2px;
  border-color: white;
`;

const ActionRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 12px;
`;

export const DebateCard: React.FC<DebateCardProps> = ({
    title,
    participants,
    format,
    status,
    audienceCount,
    timeInfo
}) => {
    const theme = useTheme();

    return (
        <CardContainer theme={theme}>
            <Header>
                <Badge theme={theme}>
                    <ThemedText style={{ fontSize: 10 }}>{format}</ThemedText>
                </Badge>
                <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>{timeInfo}</ThemedText>
            </Header>

            <ThemedText type="subtitle" style={{ marginBottom: 12 }}>{title}</ThemedText>

            <ParticipantsContainer>
                {participants.map((p, i) => (
                    <ParticipantAvatar key={i} source={{ uri: p.avatar }} />
                ))}
                {participants.length > 0 && (
                    <ThemedText style={{ marginLeft: 20, fontSize: 12, opacity: 0.8 }}>
                        With {participants.map(p => p.name).join(' & ')}
                    </ThemedText>
                )}
            </ParticipantsContainer>

            {status === 'live' && (
                <ThemedText style={{ fontSize: 12, color: theme.colors.error, marginBottom: 12 }}>
                    ● {audienceCount} watching
                </ThemedText>
            )}

            <ActionRow>
                <Button
                    label={status === 'live' ? 'Join Now' : 'Set Reminder'}
                    size="sm"
                    fullWidth={false}
                    style={{ flex: 1 }}
                />
                <Button
                    label="Details"
                    variant="secondary"
                    size="sm"
                    fullWidth={false}
                    style={{ flex: 1 }}
                />
            </ActionRow>
        </CardContainer>
    );
};
