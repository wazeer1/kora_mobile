import { apiSlice } from './apiSlice';

export const usersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyProfile: builder.query({
            query: () => '/users/me',
            providesTags: ['User'],
        }),
        getUserById: builder.query({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),
        completeOnboarding: builder.mutation({
            query: (data) => ({
                url: '/users/onboarding',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        updateUserProfile: builder.mutation({
            query: (data) => ({
                url: '/users/me',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        getLeaderboard: builder.query({
            query: () => '/users/leaderboard',
            providesTags: ['User'],
        }),
        getUserStats: builder.query({
            query: (id) => `/users/${id}`, // Stats included in public profile
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),
        searchUsers: builder.query({
            query: (query) => `/users/search?q=${query}`,
            providesTags: ['User'],
        }),
    }),
});

export const {
    useGetMyProfileQuery,
    useGetUserByIdQuery,
    useCompleteOnboardingMutation,
    useUpdateUserProfileMutation,
    useGetLeaderboardQuery,
    useGetUserStatsQuery,
    useSearchUsersQuery,
    useLazySearchUsersQuery,
} = usersApi;
