export const DebateEnums = {
    format: ['1v1', '3v3', 'ROUNDTABLE'],
    status: ['DRAFT', 'LOBBY', 'LIVE', 'PAUSED', 'ENDED', 'ARCHIVED'],
};

export const DebateRulesEnums = {
    mic_control_mode: ['CAPTAIN_CONTROL', 'HOST_CONTROL', 'FREE_FOR_ALL'],
    speaker_time_mode: ['HARD_CUT', 'SOFT_STOP'],
    victory_condition: ['AUDIENCE_VOTE', 'AI_LOGIC', 'HOST_DECISION'],
};

export const ChallengeEnums = {
    status: ['OPEN', 'ACCEPTED', 'DECLINED', 'EXPIRED'],
};

export const NotificationEnums = {
    notif_type: [
        'DRAFT_PICK',
        'TEAM_INVITE',
        'JOIN_REQUEST',
        'DEBATE_START_REMINDER',
        'DEBATE_ENDED',
        'CHALLENGE_RECEIVED',
        'CHALLENGE_ACCEPTED',
        'MODERATION_WARNING',
    ],
    action_type: ['ACCEPT', 'DECLINE', 'VIEW'],
    action_target_type: ['DEBATE', 'USER', 'CHALLENGE'],
};

export const ParticipantEnums = {
    role: ['HOST', 'CAPTAIN', 'MEMBER', 'SPECTATOR'],
    invite_status: ['PENDING', 'ACCEPTED', 'REJECTED'],
};

export const ReactionEnums = {
    reaction_type: [
        'EMOJI_FIRE',
        'EMOJI_TOMATO',
        'EMOJI_CLAP',
        'FLAG_FALLACY',
        'FLAG_CITATION',
    ],
};

export const ReportEnums = {
    report_type: ['HATE_SPEECH', 'HARASSMENT', 'DOXXING', 'SPAM', 'OTHER'],
    status: ['PENDING', 'REVIEWED', 'DISMISSED', 'ACTIONED'],
    action_taken: ['WARNING', 'SUSPENSION', 'BAN'],
};

export const TeamEnums = {
    side: ['A', 'B'],
};

export const EvidenceEnums = {
    file_type: ['IMAGE', 'PDF', 'VIDEO'],
};
