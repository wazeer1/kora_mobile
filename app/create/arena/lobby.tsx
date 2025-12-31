import { ThemedText } from '@/components/themed-text';
import { Button } from '@/src/components/atoms/Button';
import { LobbySlot } from '@/src/components/molecules/LobbySlot';
import { LobbySplitView } from '@/src/components/organisms/LobbySplitView';
import { useSocket } from '@/src/context/SocketContext'; // Assuming this exists from previous steps
import { useGetDebateStateQuery, useStartDebateMutation } from '@/src/store/api/debateApi';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #0A192F;
`;

const Header = styled.View`
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #0A192F;
  z-index: 100;
`;

const StatusPill = styled.View`
  background-color: rgba(212, 175, 55, 0.1);
  padding: 6px 12px;
  border-radius: 16px;
  border-width: 1px;
  border-color: rgba(212, 175, 55, 0.3);
  margin-top: 8px;
`;

const Footer = styled.View`
  padding: 24px;
  background-color: #0A192F;
  border-top-width: 1px;
  border-top-color: rgba(255,255,255,0.1);
`;

export default function LobbyScreen() {
  const router = useRouter();
  const { debateId } = useLocalSearchParams<{ debateId: string }>();
  const user = useSelector((state: any) => state.auth.user);
  const { socket } = useSocket();

  // API
  const { data: debateState, isLoading, refetch } = useGetDebateStateQuery(debateId, {
    skip: !debateId,
    pollingInterval: 5000 // Poll every 5s for updates if sockets fail
  });
  const [startDebate, { isLoading: isStarting }] = useStartDebateMutation();

  // Socket Listeners
  useEffect(() => {
    if (!socket || !debateId) return;

    socket.emit('join_room', { debateId });

    socket.on('debate:started', () => {
      router.replace({ pathname: '/live/[id]', params: { id: debateId, role: determineRole() } });
    });

    socket.on('debate:participant_joined', () => {
      refetch();
    });

    return () => {
      socket.off('debate:started');
      socket.off('debate:participant_joined');
    };
  }, [socket, debateId]);

  const participants = debateState?.participants || [];
  const teamA = participants.filter((p: any) => p.team === 'A') || [];
  const teamB = participants.filter((p: any) => p.team === 'B') || [];

  const leaderA = teamA.find((p: any) => p.role === 'captain' || p.is_leader) || null;
  const leaderB = teamB.find((p: any) => p.role === 'captain' || p.is_leader) || null;

  const membersA = teamA.filter((p: any) => p.id !== leaderA?.id);
  const membersB = teamB.filter((p: any) => p.id !== leaderB?.id);

  // Pad members to show slots
  const slotsA = [...membersA, ...Array(2 - membersA.length).fill(null)].slice(0, 2);
  const slotsB = [...membersB, ...Array(2 - membersB.length).fill(null)].slice(0, 2);

  const determineRole = () => {
    if (!user) return 'spectator';
    const p = participants.find((p: any) => p.id === user.id);
    if (p) return p.role === 'captain' ? (p.team === 'A' ? 'leaderA' : 'leaderB') : 'member';
    if (debateState?.created_by === user.id) return 'host';
    return 'spectator';
  };

  const myRole = determineRole();

  const handleStart = async () => {
    try {
      await startDebate({ debateId }).unwrap();
      // Socket should trigger navigation, but manual just in case
      router.replace({ pathname: '/live/[id]', params: { id: debateId, role: myRole } });
    } catch (err: any) {
      Alert.alert('Error', err?.data?.message || 'Failed to start debate');
    }
  };

  const renderFooterButton = () => {
    // HOST VIEW
    if (myRole === 'host') {
      const allReady = teamA.length > 0 && teamB.length > 0; // Simple ready check

      return (
        <Button
          label={isStarting ? "STARTING..." : (allReady ? "START ARENA" : "WAITING FOR PLAYERS...")}
          onPress={handleStart}
          fullWidth
          disabled={!allReady || isStarting}
          style={{ backgroundColor: allReady ? '#D4AF37' : '#333', opacity: allReady ? 1 : 0.5 }}
          labelStyle={{ color: allReady ? '#0A192F' : '#888', fontWeight: 'bold' }}
        />
      );
    }

    // MEMBER VIEW
    if (['leaderA', 'leaderB', 'member'].includes(myRole)) {
      return (
        <Button
          label="WAITING FOR HOST TO START..."
          disabled
          fullWidth
          style={{ backgroundColor: '#333' }}
          labelStyle={{ color: '#888' }}
        />
      );
    }

    // SPECTATOR VIEW
    return (
      <Button
        label="SHARE EVENT"
        onPress={() => Alert.alert('Shared!')}
        fullWidth
        variant="outline"
      />
    );
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
      <Stack.Screen
        options={{
          title: 'Lobby',
          headerShown: true,
          headerStyle: { backgroundColor: '#0A192F' },
          headerTintColor: 'white',
        }}
      />

      <Header>
        <ThemedText type="title" style={{ color: '#D4AF37', textAlign: 'center' }}>
          {debateState?.title || 'Loading...'}
        </ThemedText>
        <StatusPill>
          <ThemedText style={{ color: '#D4AF37', fontSize: 12, fontWeight: 'bold' }}>
            {debateState?.status === 'PENDING' ? "WAITING FOR PLAYERS..." : debateState?.status}
          </ThemedText>
        </StatusPill>
        <ThemedText style={{ color: '#B0B3B8', fontSize: 12, marginTop: 8 }}>
          {debateState?.format} • {user?.username} ({myRole})
        </ThemedText>
      </Header>

      <LobbySplitView>
        {/* Team A (Blue) */}
        <View style={{ alignItems: 'center', width: '100%' }}>
          <ThemedText style={{ color: '#4ECDC4', fontWeight: 'bold', marginBottom: 20 }}>RATIONALISTS</ThemedText>

          <LobbySlot
            user={leaderA ? { name: leaderA.handle, avatar: leaderA.avatar_url } : null}
            role="leader"
            status={leaderA ? 'filled' : 'pending'}
            side="blue"
          />

          {slotsA.map((m: any, i: number) => (
            <LobbySlot
              key={i}
              user={m ? { name: m.handle, avatar: m.avatar_url } : null}
              role="member"
              status={m ? 'filled' : 'empty'}
              side="blue"
              onPress={() => { }}
            />
          ))}
        </View>

        {/* Team B (Red) */}
        <View style={{ alignItems: 'center', width: '100%' }}>
          <ThemedText style={{ color: '#FF6B6B', fontWeight: 'bold', marginBottom: 20 }}>IDEALISTS</ThemedText>

          <LobbySlot
            user={leaderB ? { name: leaderB.handle, avatar: leaderB.avatar_url } : null}
            role="leader"
            status={leaderB ? 'filled' : 'pending'}
            side="red"
          />

          {slotsB.map((m: any, i: number) => (
            <LobbySlot
              key={i}
              user={m ? { name: m.handle, avatar: m.avatar_url } : null}
              role="member"
              status={m ? 'filled' : 'empty'}
              side="red"
              onPress={() => { }}
            />
          ))}
        </View>
      </LobbySplitView>

      <Footer>
        {renderFooterButton()}
      </Footer>
    </Container>
  );
}
