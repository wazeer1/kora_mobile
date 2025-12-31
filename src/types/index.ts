export interface Topic {
    id: string;
    name: string;
    description?: string;
    category?: string;
    icon?: string;
    slug?: string;
}

export interface User {
    id: string;
    handle: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar_url?: string;
    bio?: string;
    elo_rating: number;
    total_debates: number;
    total_wins: number;
    minds_changed_delta: number;
    badges: any[];
    onboarding_complete: boolean;
    is_active: boolean;
    is_banned: boolean;
    role?: {
        id: string;
        name: string;
    };
    topics?: Topic[];
    created_at: string;
}

export interface Participant {
    id: string;
    debate_id: string;
    user_id: string; // can be null in backend but usually hydrated in UI
    team_id: string;
    role: 'HOST' | 'CAPTAIN' | 'MEMBER' | 'SPECTATOR';
    invite_status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    user?: User; // Joined
}

export interface Team {
    id: string;
    debate_id: string;
    name: string;
    side: 'A' | 'B';
    captain_id: string;
    is_ready: boolean;
    participants?: Participant[];
}

export interface Debate {
    id: string;
    host_id: string;
    topic_id?: string;
    title: string;
    description?: string;
    format: '1v1' | '3v3' | 'ROUNDTABLE';
    status: 'DRAFT' | 'LOBBY' | 'LIVE' | 'PAUSED' | 'ENDED' | 'ARCHIVED';
    scheduled_at?: string;
    started_at?: string;
    ended_at?: string;
    host?: User;
    topic?: Topic;
    teams?: Team[];
    participants?: Participant[];
}

export interface Challenge {
    id: string;
    challenger_id: string;
    challenged_id: string;
    debate_id?: string;
    status: 'OPEN' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
    challenge_message?: string;
    expires_at: string;
    challenger?: User;
    challenged?: User;
    debate?: Debate;
}

export interface Notification {
    id: string;
    user_id: string; // recipient
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    action_type?: string;
    action_target_id?: string;
    action_payload?: any;
    created_at: string;
}
