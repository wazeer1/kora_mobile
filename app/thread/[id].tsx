import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

const Container = styled(ThemedView)`
  flex: 1;
  background-color: #0A192F;
`;

const RootNode = styled.View`
  padding: 24px;
  background-color: rgba(255,255,255,0.05);
  border-bottom-width: 1px;
  border-bottom-color: rgba(212, 175, 55, 0.2);
`;

const TreeContainer = styled.ScrollView`
  flex: 1;
`;

const BranchContainer = styled.View`
  flex-direction: row;
  padding: 24px;
`;

const BranchColumn = styled.View`
  flex: 1;
  gap: 16px;
`;

const NodeCard = styled.View<{ side: 'pro' | 'con' }>`
  background-color: ${props => props.side === 'pro' ? 'rgba(78, 205, 196, 0.1)' : 'rgba(255, 107, 107, 0.1)'};
  border-left-width: 4px;
  border-left-color: ${props => props.side === 'pro' ? '#4ECDC4' : '#FF6B6B'};
  padding: 12px;
  border-radius: 8px;
`;

const NodeText = styled(ThemedText)`
  font-size: 14px;
  line-height: 20px;
`;

export default function ThreadScreen() {
    const { id } = useLocalSearchParams();

    return (
        <Container>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Debate Tree",
                    headerTintColor: "white",
                    headerStyle: { backgroundColor: '#0A192F' },
                    headerBackTitle: "Arena"
                }}
            />

            <RootNode>
                <ThemedText type="title" style={{ fontSize: 24, marginBottom: 12 }}>
                    Universal Basic Income is inevitable.
                </ThemedText>
                <ThemedText style={{ opacity: 0.7 }}>
                    Automation will displace 40% of jobs by 2035. We need a floor.
                </ThemedText>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                    <IconSymbol name="arrow.up" size={16} color="#D4AF37" />
                    <ThemedText>1.4k Deltas</ThemedText>
                </View>
            </RootNode>

            <TreeContainer>
                <BranchContainer>
                    <BranchColumn>
                        <ThemedText style={{ color: '#4ECDC4', fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>PRO</ThemedText>
                        <NodeCard side="pro">
                            <NodeText>It creates artistic freedom.</NodeText>
                        </NodeCard>
                        <View style={{ width: 2, height: 20, backgroundColor: '#4ECDC4', marginLeft: 20 }} />
                        <NodeCard side="pro">
                            <NodeText>Innovation actually increases when survival isn't at stake.</NodeText>
                        </NodeCard>
                    </BranchColumn>

                    <View style={{ width: 2, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 12 }} />

                    <BranchColumn>
                        <ThemedText style={{ color: '#FF6B6B', fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>CON</ThemedText>
                        <NodeCard side="con">
                            <NodeText>Inflation will eat the value immediately.</NodeText>
                        </NodeCard>
                        <View style={{ width: 2, height: 20, backgroundColor: '#FF6B6B', marginLeft: 20 }} />
                        <NodeCard side="con">
                            <NodeText>Landlords will just raise rent by $1000.</NodeText>
                        </NodeCard>
                    </BranchColumn>
                </BranchContainer>
            </TreeContainer>
        </Container>
    );
}
