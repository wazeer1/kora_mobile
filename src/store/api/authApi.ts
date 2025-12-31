import { clearTokens, saveTokens } from '@/src/utils/tokenStorage';
import { logout as logoutAction, setCredentials } from '../slices/authSlice';
import { apiSlice } from './apiSlice';

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Response: { access_token, refresh_token, user: { ... } }
                    // Some APIs wrap in { data: ... } or return directly. 
                    // Based on apiSlice, we might expect nested data, but docs say direct response.
                    // Adjusting to handle generic structure or direct.
                    const responseData = data?.data || data;
                    const { access_token, user, refresh_token } = responseData || {};

                    if (access_token && user) {
                        dispatch(setCredentials({ user, token: access_token, refreshToken: refresh_token }));
                        await saveTokens(access_token, refresh_token || '');
                    }
                } catch (err) { }
            },
        }),
        magicLink: builder.mutation({
            query: (email) => ({
                url: '/auth/magic-link',
                method: 'POST',
                body: { email },
            }),
        }),
        verifyOtp: builder.mutation({
            query: (payload) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body: payload,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const responseData = data?.data || data;
                    const { access_token, user, refresh_token } = responseData || {};

                    if (access_token && user) {
                        dispatch(setCredentials({
                            user,
                            token: access_token,
                            refreshToken: refresh_token
                        }));
                        await saveTokens(access_token, refresh_token || '');
                    }
                } catch (err) { }
            },
        }),
        checkHandle: builder.query({
            query: (handle) => `/auth/check-handle?handle=${handle}`,
        }),
        refreshToken: builder.mutation({
            query: (refreshToken) => ({
                url: '/auth/refresh',
                method: 'POST',
                body: { refreshToken },
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                // Logic mostly in apiSlice reauth, calling this endpoint directly if needed
            },
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout', // Not in doc provided but standard
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logoutAction());
                    await clearTokens();
                } catch (err) {
                    dispatch(logoutAction());
                    await clearTokens();
                }
            },
        }),
    }),
    overrideExisting: true,
});

export const {
    useLoginMutation,
    useMagicLinkMutation,
    useVerifyOtpMutation,
    useCheckHandleQuery,
    useRefreshTokenMutation,
    useLogoutMutation,
    useLazyCheckHandleQuery,
} = authApi;
