import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/src/components/atoms/Button';
import { Accordion } from '@/src/components/molecules/Accordion';
import { RockerSwitch } from '@/src/components/molecules/RockerSwitch';
import { UserPicker } from '@/src/components/molecules/UserPicker';
import { PhaseBuilder } from '@/src/components/organisms/PhaseBuilder';
import { useCreateDebateMutation, useInviteLeaderMutation } from '@/src/store/api/debateApi';
import { selectCurrentUser } from '@/src/store/slices/authSlice';
import Slider from '@react-native-community/slider';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #0A192F;
`;

// Zone A: Billboard
const BillboardContainer = styled.View`
  height: 240px;
  background-color: #112240;
  position: relative;
`;

const CoverImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const UploadOverlay = styled.TouchableOpacity`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: rgba(255,255,255,0.1);
  border-style: dashed;
`;

const TitleInput = styled(TextInput)`
  font-family: serif;
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-shadow-color: rgba(0,0,0,0.75);
  text-shadow-offset: 0px 2px;
  text-shadow-radius: 4px;
  margin-bottom: 8px;
`;

const DescriptionInput = styled(TextInput)`
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  height: 60px;
`;

const InfoBox = styled.View`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 24px;
`;

// Form Elements
const FormatCard = styled.TouchableOpacity<{ active: boolean }>`
  width: 100px;
  height: 100px;
  background-color: ${props => props.active ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.05)'};
  border-radius: 12px;
  border-width: 1px;
  border-color: ${props => props.active ? '#D4AF37' : 'rgba(255,255,255,0.1)'};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const StyledInput = styled(TextInput)`
  border-bottom-width: 1px;
  border-bottom-color: rgba(255,255,255,0.2);
  color: white;
  padding-vertical: 8px;
  font-size: 16px;
  margin-bottom: 16px;
`;

const Footer = styled.View`
  padding: 16px 24px;
  border-top-width: 1px;
  border-top-color: rgba(255,255,255,0.1);
  background-color: #0A192F;
`;

const DurationBadge = styled.View`
  background-color: rgba(212, 175, 55, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
  align-self: center;
  margin-bottom: 12px;
`;

export default function ArenaSetupScreen() {
    const router = useRouter();
    const user = useSelector(selectCurrentUser);
    const [image, setImage] = useState<string | null>(null);
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');

    // API
    const [createDebate, { isLoading: isCreating }] = useCreateDebateMutation();
    const [inviteLeader, { isLoading: isInviting }] = useInviteLeaderMutation();

    // Roster
    const [format, setFormat] = useState<'duel' | 'squad' | 'roundtable'>('squad');
    const [sideAName, setSideAName] = useState('Proponents');
    const [sideBName, setSideBName] = useState('Opponents');
    const [sideALeader, setSideALeader] = useState<any>({ name: 'You', username: '@me', id: 'me', avatar: 'https://i.pravatar.cc/100?u=me' });
    const [sideBLeader, setSideBLeader] = useState<any>(null);

    // Timeline
    const [introTime, setIntroTime] = useState(3);
    const [aiIntro, setAiIntro] = useState(false);

    const [rounds, setRounds] = useState(3);
    const [timePerSide, setTimePerSide] = useState(3);
    const [crossfire, setCrossfire] = useState(true);

    const [conclusionTime, setConclusionTime] = useState(2);
    const [aiSummary, setAiSummary] = useState(true);

    // Rules
    const [hardCut, setHardCut] = useState(true);
    const [softStop, setSoftStop] = useState(false);
    const [captainCommand, setCaptainCommand] = useState(true);

    // Verdict
    const [aiReport, setAiReport] = useState(true);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });
        if (!result.canceled) setImage(result.assets[0].uri);
    };

    const totalDuration = useMemo(() => {
        // Intro + (Rounds * (SideA + SideB) + Crossfire(approx 2m)) + Conclusion
        const roundTotal = rounds * (timePerSide * 2 + (crossfire ? 2 : 0));
        return introTime + roundTotal + conclusionTime;
    }, [introTime, rounds, timePerSide, crossfire, conclusionTime]);

    const isReady = topic.trim().length >= 3 && user?.id && (format === 'roundtable' || sideBLeader !== null);

    const handleCreate = async () => {
        if (!isReady) return;

        if (topic.trim().length < 3) {
            Alert.alert("Invalid Title", "Title must be at least 3 characters long.");
            return;
        }

        try {
            const debateFormat = format === 'duel' ? '1v1' : (format === 'squad' ? '2v2' : 'roundtable');

            const payload: any = {
                title: topic,
                description,
                host_id: user?.id,
                format: debateFormat,
                rules: {
                    rounds,
                    turn_duration_seconds: timePerSide * 60,
                    crossfire_enabled: crossfire,
                    intro_duration_seconds: introTime * 60,
                    conclusion_duration_seconds: conclusionTime * 60,
                    hard_cut_enabled: hardCut,
                    grace_period_seconds: softStop ? 15 : 0,
                    captain_only_mic: captainCommand,
                    ai_report_enabled: aiReport,
                },
                // scheduled_at defaults to now/null which means "pending start"
            };

            const debate = await createDebate(payload).unwrap();

            if (sideBLeader && sideBLeader.id && debate.id) {
                // Invite logic
                try {
                    await inviteLeader({ debateId: debate.id, userId: sideBLeader.id }).unwrap();
                } catch (inviteErr) {
                    console.log('Invite failed', inviteErr);
                    // Continue anyway, can invite later
                    Alert.alert('Notice', 'Debate created but failed to invite leader. You can invite them from the lobby.');
                }
            }

            router.replace({ pathname: '/create/arena/lobby', params: { debateId: debate.id } });

        } catch (error: any) {
            Alert.alert('Error', error?.data?.message || 'Failed to create debate');
        }
    };

    return (
        <Container>
            <Stack.Screen
                options={{
                    title: 'New Arena',
                    headerShown: true,
                    headerStyle: { backgroundColor: '#0A192F' },
                    headerTintColor: 'white',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16 }}>
                            <ThemedText style={{ color: 'white' }}>Cancel</ThemedText>
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={handleCreate} disabled={!isReady || isCreating} style={{ marginRight: 16 }}>
                            <ThemedText style={{ color: isReady ? '#D4AF37' : 'gray' }}>
                                {isCreating ? 'Saving...' : 'Save Draft'}
                            </ThemedText>
                        </TouchableOpacity>
                    )
                }}
            />

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Zone A: Billboard */}
                <BillboardContainer>
                    {image ? (
                        <>
                            <CoverImage source={{ uri: image }} />
                            <LinearGradient
                                colors={['transparent', '#0A192F']}
                                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 160 }}
                            />
                        </>
                    ) : (
                        <UploadOverlay onPress={pickImage}>
                            <IconSymbol name="plus" size={32} color="rgba(255,255,255,0.3)" />
                            <ThemedText style={{ color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>Add Cover Image</ThemedText>
                        </UploadOverlay>
                    )}

                    <InfoBox>
                        <TitleInput
                            placeholder="Topic Title"
                            placeholderTextColor="rgba(255,255,255,0.5)"
                            multiline
                            maxLength={80}
                            value={topic}
                            onChangeText={setTopic}
                        />
                        <DescriptionInput
                            placeholder="Short description for the audience..."
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            multiline
                            maxLength={200}
                            value={description}
                            onChangeText={setDescription}
                        />
                    </InfoBox>
                </BillboardContainer>

                {/* Zone B: Roster */}
                <Accordion title="The Roster" defaultExpanded={true}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
                        <FormatCard active={format === 'duel'} onPress={() => setFormat('duel')}>
                            <IconSymbol name="person.fill" size={28} color={format === 'duel' ? '#D4AF37' : 'white'} />
                            <ThemedText style={{ marginTop: 8, fontSize: 12 }}>Duel</ThemedText>
                        </FormatCard>
                        <FormatCard active={format === 'squad'} onPress={() => setFormat('squad')}>
                            <IconSymbol name="person.3.fill" size={28} color={format === 'squad' ? '#D4AF37' : 'white'} />
                            <ThemedText style={{ marginTop: 8, fontSize: 12 }}>Squad</ThemedText>
                        </FormatCard>
                        <FormatCard active={format === 'roundtable'} onPress={() => setFormat('roundtable')}>
                            <IconSymbol name="stop.circle" size={28} color={format === 'roundtable' ? '#D4AF37' : 'white'} />
                            <ThemedText style={{ marginTop: 8, fontSize: 12 }}>Roundtable</ThemedText>
                        </FormatCard>
                    </ScrollView>

                    <ThemedText style={{ color: '#D4AF37', marginBottom: 8, fontSize: 12, fontWeight: 'bold' }}>SIDE A (HOST)</ThemedText>
                    <StyledInput value={sideAName} onChangeText={setSideAName} placeholder="Team Name" placeholderTextColor="gray" />
                    <UserPicker value={sideALeader} onSelect={setSideALeader} label="Team Leader" />

                    <View style={{ height: 24 }} />

                    <ThemedText style={{ color: '#FF6B6B', marginBottom: 8, fontSize: 12, fontWeight: 'bold' }}>SIDE B (CHALLENGER)</ThemedText>
                    <StyledInput value={sideBName} onChangeText={setSideBName} placeholder="Team Name" placeholderTextColor="gray" />
                    <UserPicker value={sideBLeader} onSelect={setSideBLeader} label="Team Leader" placeholder="Search opponent..." />
                </Accordion>

                {/* Zone C: Timeline */}
                <Accordion title="The Timeline">
                    <PhaseBuilder
                        label="Phase 1: Introduction"
                        duration={introTime}
                        onDurationChange={setIntroTime}
                        aiEnabled={aiIntro}
                        onAiToggle={setAiIntro}
                        showAiOptions
                    />

                    <View style={{ marginVertical: 12 }}>
                        <ThemedText style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Phase 2: Main Argument</ThemedText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <ThemedText>Rounds: {rounds}</ThemedText>
                            <Slider
                                style={{ width: 150, height: 40 }}
                                minimumValue={1} maximumValue={5} step={1}
                                value={rounds} onValueChange={setRounds}
                                minimumTrackTintColor="#D4AF37" thumbTintColor="white"
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <ThemedText>Time Per Side: {timePerSide}m</ThemedText>
                            <Slider
                                style={{ width: 150, height: 40 }}
                                minimumValue={1} maximumValue={10} step={1}
                                value={timePerSide} onValueChange={setTimePerSide}
                                minimumTrackTintColor="#D4AF37" thumbTintColor="white"
                            />
                        </View>
                    </View>

                    <PhaseBuilder
                        label="Phase 3: Conclusion"
                        duration={conclusionTime}
                        onDurationChange={setConclusionTime}
                        aiEnabled={aiSummary}
                        onAiToggle={setAiSummary}
                        showAiOptions
                    />
                </Accordion>

                {/* Zone D: Physics */}
                <Accordion title="The Physics">
                    <RockerSwitch label="Hard Cut (Mute at 0:00)" value={hardCut} onValueChange={setHardCut} />
                    <RockerSwitch label="Grace Period (15s)" value={softStop} onValueChange={setSoftStop} />

                    <View style={{ opacity: format === 'squad' ? 0.5 : 1, marginTop: 12 }}>
                        <RockerSwitch
                            label="Captain's Command Only"
                            value={format === 'squad' ? true : captainCommand}
                            onValueChange={setCaptainCommand}
                        />
                        {format === 'squad' && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -10, marginBottom: 10 }}>
                                <IconSymbol name="lock.fill" size={12} color="#D4AF37" />
                                <ThemedText style={{ fontSize: 10, color: '#D4AF37', marginLeft: 4 }}>Locked for Team Battles</ThemedText>
                            </View>
                        )}
                    </View>
                </Accordion>

                {/* Zone E: Verdict */}
                <Accordion title="The Verdict">
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                        <ThemedText>Spectators Can Vote</ThemedText>
                        <IconSymbol name="checkmark.circle.fill" size={24} color="#4ECDC4" />
                    </View>
                    <RockerSwitch label="Generate AI Report" value={aiReport} onValueChange={setAiReport} />
                    <ThemedText style={{ fontSize: 10, color: '#B0B3B8' }}>AI will analyze logical fallacies and generate a report.</ThemedText>
                </Accordion>

            </ScrollView>

            <Footer>
                <DurationBadge>
                    <ThemedText style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: 12 }}>
                        Est. Duration: {totalDuration} Mins
                    </ThemedText>
                </DurationBadge>
                <Button
                    label={isCreating || isInviting ? "CREATING..." : "CREATE & INVITE LEADERS"}
                    onPress={handleCreate}
                    fullWidth
                    disabled={!isReady || isCreating || isInviting}
                    style={{ backgroundColor: isReady ? '#D4AF37' : '#333' }}
                    labelStyle={{ color: isReady ? '#0A192F' : '#666', fontWeight: 'bold' }}
                />
            </Footer>
        </Container>
    );
}
