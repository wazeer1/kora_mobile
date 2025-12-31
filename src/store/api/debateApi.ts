import { apiSlice } from './apiSlice';

export const debateApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createDebate: builder.mutation({
            query: (debateData) => ({
                url: '/debate/create',
                method: 'POST',
                body: debateData,
            }),
            invalidatesTags: ['Debate', 'Home'],
        }),
        updateRules: builder.mutation({
            query: ({ id, rules }) => ({
                url: `/debate/${id}/rules`,
                method: 'PUT',
                body: rules,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Debate', id }],
        }),
        scheduleDebate: builder.mutation({
            query: ({ id, scheduledAt }) => ({
                url: `/debate/${id}/schedule`,
                method: 'POST',
                body: { scheduledAt },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Debate', id }, 'Home'],
        }),
        startDebate: builder.mutation({
            query: (id) => ({
                url: `/debate/${id}/start`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Debate', id }],
        }),
        cancelDebate: builder.mutation({
            query: (id) => ({
                url: `/debate/${id}/cancel`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Debate', id }, 'Home'],
        }),
        pauseDebate: builder.mutation({
            query: (id) => ({
                url: `/debate/${id}/pause`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Debate', id }],
        }),
        joinTeam: builder.mutation({
            query: ({ id, teamId }) => ({
                url: `/debate/${id}/join-team`,
                method: 'POST',
                body: { teamId },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Debate', id }],
        }),
        requestJoin: builder.mutation({
            query: (id) => ({
                url: `/debate/${id}/request-join`,
                method: 'POST',
            }),
        }),
        inviteLeader: builder.mutation({
            query: ({ id, userId }) => ({
                url: `/debate/${id}/invite-leader`,
                method: 'POST',
                body: { userId },
            }),
        }),
        kickMember: builder.mutation({
            query: ({ id, userId }) => ({
                url: `/debate/${id}/kick-member`,
                method: 'POST',
                body: { userId },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Debate', id }],
        }),
        toggleReady: builder.mutation({
            query: (id) => ({
                url: `/debate/${id}/toggle-ready`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Debate', id }],
        }),
        getParticipants: builder.query({
            query: (id) => `/debate/${id}/participants`,
            providesTags: (result, error, id) => [{ type: 'Debate', id: `PARTICIPANTS-${id}` }],
        }),
        getDebateSummary: builder.query({
            query: (id) => `/debate/${id}/summary`,
            providesTags: (result, error, id) => [{ type: 'Debate', id: `SUMMARY-${id}` }],
        }),
        analyzeDebate: builder.mutation({
            query: (id) => ({
                url: `/debate/${id}/ai-analyze`,
                method: 'POST',
            }),
        }),
        getDebateState: builder.query({
            query: (id) => `/debate/${id}/state`,
            providesTags: (result, error, id) => [{ type: 'Debate', id: `STATE-${id}` }],
        }),
        requestMic: builder.mutation({
            query: (id) => ({
                url: `/debate/${id}/mic/request`,
                method: 'POST',
            }),
        }),
        grantMic: builder.mutation({
            query: ({ id, userId }) => ({
                url: `/debate/${id}/mic/grant`,
                method: 'POST',
                body: { userId },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Debate', id: `STATE-${id}` }],
        }),
        yieldMic: builder.mutation({
            query: (id) => ({
                url: `/debate/${id}/mic/yield`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Debate', id: `STATE-${id}` }],
        }),
        muteAll: builder.mutation({
            query: (id) => ({
                url: `/debate/${id}/mic/mute-all`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Debate', id: `STATE-${id}` }],
        }),
        vote: builder.mutation({
            query: ({ id, data }) => ({
                url: `/debate/${id}/vote`,
                method: 'POST',
                body: data,
            }),
        }),
        react: builder.mutation({
            query: ({ id, emoji }) => ({
                url: `/debate/${id}/react`,
                method: 'POST',
                body: { emoji },
            }),
        }),
        uploadEvidence: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/debate/${id}/evidence/upload`,
                method: 'POST',
                body: formData,
            }),
        }),
        presentEvidence: builder.mutation({
            query: ({ id, evidenceId }) => ({
                url: `/debate/${id}/evidence/present`,
                method: 'POST',
                body: { evidence_id: evidenceId },
            }),
        }),
        flagContent: builder.mutation({
            query: ({ id, reason }) => ({
                url: `/debate/${id}/flag`,
                method: 'POST',
                body: { reason },
            }),
        }),
    }),
});

export const {
    useCreateDebateMutation,
    useUpdateRulesMutation,
    useScheduleDebateMutation,
    useStartDebateMutation,
    useCancelDebateMutation,
    usePauseDebateMutation,
    useJoinTeamMutation,
    useRequestJoinMutation,
    useInviteLeaderMutation,
    useKickMemberMutation,
    useToggleReadyMutation,
    useGetParticipantsQuery,
    useGetDebateSummaryQuery,
    useAnalyzeDebateMutation,
    useGetDebateStateQuery,
    useRequestMicMutation,
    useGrantMicMutation,
    useYieldMicMutation,
    useMuteAllMutation,
    useVoteMutation,
    useReactMutation,
    useUploadEvidenceMutation,
    usePresentEvidenceMutation,
    useFlagContentMutation,
} = debateApi;
