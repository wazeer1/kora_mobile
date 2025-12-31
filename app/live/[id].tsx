import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { EnergyBar } from '@/src/components/molecules/EnergyBar';
import { AudienceTabs } from '@/src/components/organisms/AudienceTabs';
import { ControlDock } from '@/src/components/organisms/ControlDock';
import { DebateStage } from '@/src/components/organisms/DebateStage';
import { PresentationStage } from '@/src/components/organisms/PresentationStage';
import { WarRoomRole } from '@/src/components/organisms/WarRoomWidget';
import { useSocket } from '@/src/context/SocketContext';
import { useGetDebateStateQuery } from '@/src/store/api/debateApi';
import { BlurView } from 'expo-blur';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StatusBar, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #020C1B;
`;

// Zone A: Scoreboard HUD
const Scoreboard = styled(BlurView)`
  position: absolute;
  top: 60px;
  left: 20px;
  right: 20px;
  height: 50px;
  border-radius: 25px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  z-index: 50;
  border-width: 1px;
  border-color: rgba(255,255,255,0.1);
  overflow: hidden;
`;

const TopicHeader = styled.View`
  position: absolute;
  top: 120px;
  left: 0;
  right: 0;
  align-items: center;
  z-index: 40;
`;

const TopicPill = styled(BlurView)`
  padding: 6px 16px;
  border-radius: 20px;
  overflow: hidden;
`;

export default function LiveRoomScreen() {
    const router = useRouter();
    const { id, role } = useLocalSearchParams<{ id: string, role: string }>();
    const currentRole = (role as WarRoomRole) || 'spectator';
    const { socket } = useSocket();
    const user = useSelector((state: any) => state.auth.user);

    // API
    const { data: debateState, isLoading, refetch } = useGetDebateStateQuery(id, {
        pollingInterval: 5000,
        skip: !id
    });

    // State
    const [viewMode, setViewMode] = useState<'general' | 'presenting'>('general');
    const [currentDocUrl, setCurrentDocUrl] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState('00:00');

    // Socket
    useEffect(() => {
        if (!socket || !id) return;
        socket.emit('join_room', { debateId: id });

        socket.on('debate:updated', () => refetch());
        socket.on('debate:turn_changed', () => refetch());
        socket.on('debate:ended', () => {
            Alert.alert('Debate Ended', 'The debate has concluded.');
            router.back();
        });

        return () => {
            socket.off('debate:updated');
            socket.off('debate:turn_changed');
            socket.off('debate:ended');
        };
    }, [socket, id]);

    // Timer Logic
    useEffect(() => {
        if (!debateState?.current_turn_ends_at) return;
        const interval = setInterval(() => {
            const now = new Date();
            const end = new Date(debateState.current_turn_ends_at);
            const diff = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
            const m = Math.floor(diff / 60);
            const s = diff % 60;
            setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(interval);
    }, [debateState?.current_turn_ends_at]);

    // Derived Data
    const participants = debateState?.participants || [];

    const teamA = useMemo(() => {
        const team = participants.filter((p: any) => p.team === 'A');
        const leader = team.find((p: any) => p.role === 'captain' || p.is_leader);
        const members = team.filter((p: any) => p.id !== leader?.id);
        return {
            leader: leader ? { id: leader.id, name: leader.handle, avatar: leader.avatar_url } : { id: 'bot', name: 'Bot', avatar: '' },
            members: members.map((m: any) => ({ id: m.id, name: m.handle, avatar: m.avatar_url }))
        };
    }, [participants]);

    const teamB = useMemo(() => {
        const team = participants.filter((p: any) => p.team === 'B');
        const leader = team.find((p: any) => p.role === 'captain' || p.is_leader);
        const members = team.filter((p: any) => p.id !== leader?.id);
        return {
            leader: leader ? { id: leader.id, name: leader.handle, avatar: leader.avatar_url } : { id: 'bot', name: 'Bot', avatar: '' },
            members: members.map((m: any) => ({ id: m.id, name: m.handle, avatar: m.avatar_url }))
        };
    }, [participants]);

    const spectators = useMemo(() => {
        return participants.filter((p: any) => !p.team).map((p: any) => ({
            id: p.id,
            name: p.handle,
            avatar: p.avatar_url,
            role: 'spectator'
        }));
    }, [participants]);

    const handleAction = (action: string) => {
        console.log(`Action: ${action}`);
        switch (action) {
            case 'leave':
                router.back();
                break;
            case 'raise_hand':
                Alert.alert('Hand Raised', 'Moderator notified.');
                // TODO: Call mutation
                break;
            default:
                break;
        }
    };

    if (isLoading) {
        return (
            <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#D4AF37" />
            </Container>
        );
    }

    return (
        <Container>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="light-content" />

            {/* HEADER: SCOREBOARD */}
            <Scoreboard intensity={50} tint="dark">
                <EnergyBar value={debateState?.score_a || 50} color="#00FFFF" label={`${debateState?.score_a || 50}%`} />
                <ThemedText style={{ fontWeight: 'bold', marginHorizontal: 10 }}>{timeLeft}</ThemedText>
                <EnergyBar value={debateState?.score_b || 50} color="#FF0055" label={`${debateState?.score_b || 50}%`} alignRight />
                <TouchableOpacity onPress={() => { }} style={{ marginLeft: 10 }}>
                    <IconSymbol name="info.circle" size={20} color="grey" />
                </TouchableOpacity>
            </Scoreboard>

            {/* TOPIC HEADER */}
            {viewMode === 'general' && (
                <TopicHeader>
                    <TopicPill intensity={30}>
                        <ThemedText style={{ fontSize: 12, fontWeight: 'bold' }}>TOPIC: {debateState?.title?.toUpperCase()}</ThemedText>
                    </TopicPill>
                </TopicHeader>
            )}

            {/* MAIN CONTENT AREA */}
            {viewMode === 'general' ? (
                <View style={{ flex: 1 }}>
                    {/* TOP HALF: DEBATE STAGE */}
                    <DebateStage
                        hostAvatar={debateState?.host_avatar || "https://i.pravatar.cc/300?u=host"}
                        teamA={teamA}
                        teamB={teamB}
                        isSpeaking={debateState?.current_speaker_id}
                        onAvatarPress={(uid, name) => Alert.alert('Profile', name)}
                    />

                    {/* BOTTOM HALF: AUDIENCE / DOCS */}
                    <AudienceTabs
                        spectators={spectators}
                        documents={debateState?.evidence || []} // Assuming evidence array
                        onPresentDoc={(url) => { setCurrentDocUrl(url); setViewMode('presenting'); }}
                        onRequestJoin={(team) => Alert.alert('Request Sent', `Joining ${team}`)}
                    />
                </View>
            ) : (
                /* PRESENTING MODE */
                <PresentationStage
                    docUrl={currentDocUrl || ''}
                    speakers={[
                        { ...teamA.leader, isSpeaking: debateState?.current_speaker_id === teamA.leader.id },
                        { ...teamB.leader, isSpeaking: debateState?.current_speaker_id === teamB.leader.id },
                    ]}
                    onClose={() => setViewMode('general')}
                />
            )}

            {/* BOTTOM: CONTROL DOCK */}
            <ControlDock
                role={currentRole}
                onAction={handleAction}
                joinRequestCount={0}
            />

        </Container>
    );
}
