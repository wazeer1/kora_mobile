import { apiSlice } from './apiSlice';

export const socialApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        challengeUser: builder.mutation({
            query: ({ userId, topicId }) => ({
                url: `/social/user/${userId}/challenge`,
                method: 'POST',
                body: { topicId },
            }),
            invalidatesTags: ['Social'],
        }),
        acceptChallenge: builder.mutation({
            query: (id) => ({
                url: `/social/challenge/${id}/accept`,
                method: 'POST',
            }),
            invalidatesTags: ['Social', 'Debate'],
        }),
        declineChallenge: builder.mutation({
            query: (id) => ({
                url: `/social/challenge/${id}/decline`,
                method: 'POST',
            }),
            invalidatesTags: ['Social'],
        }),
        getGauntlet: builder.query({
            query: () => '/social/explore/gauntlet',
            providesTags: ['Social'],
        }),
        searchSocial: builder.query({
            query: (query) => `/social/explore/search?q=${query}`,
            providesTags: ['Social'],
        }),
        report: builder.mutation({
            query: (reportData) => ({
                url: `/social/report`,
                method: 'POST',
                body: reportData,
            }),
        }),
    }),
});

export const {
    useChallengeUserMutation,
    useAcceptChallengeMutation,
    useDeclineChallengeMutation,
    useGetGauntletQuery,
    useSearchSocialQuery,
    useReportMutation,
} = socialApi;
