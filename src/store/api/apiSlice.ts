import { clearTokens, getTokens, saveTokens } from '@/src/utils/tokenStorage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setCredentials } from '../slices/authSlice';

const baseQuery = fetchBaseQuery({
    // Android Emulator uses 10.0.2.2 to access host localhost.
    // For physical device, use your machine's LAN IP (e.g., http://192.168.1.5:8000/api/v1)
    baseUrl: 'http://10.113.236.230:8000/api/v1',
    prepareHeaders: async (headers, { getState }) => {
        // Using 'any' here to avoid circular dependency with store.ts
        // We assume the auth slice is named 'auth' and has a 'token' field.
        let token = (getState() as any).auth?.token;

        // If token not in state (e.g., during hydration race condition), try storage fallback
        if (!token) {
            const { accessToken } = await getTokens();
            token = accessToken;
        }

        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    // console.log('API_REQUEST:', args, api, extraOptions);

    let result = await baseQuery(args, api, extraOptions);
    // console.log('API_RESPONSE:', result);
    // If 401 Unauthorized, try to refresh
    if (result.error && result.error.status === 401) {
        console.log('API_401: Attempting refresh...');

        // Get refresh token from state
        const refreshToken = (api.getState() as any).auth.refreshToken;

        if (refreshToken) {
            // Call refresh endpoint
            // We use baseQuery directly to avoid infinite loop
            const refreshResult = await baseQuery(
                {
                    url: '/auth/refresh',
                    method: 'POST',
                    body: { refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                console.log('REFRESH_SUCCESS: Retrying original request');
                const data: any = refreshResult.data;
                const { token, user } = data.data || {};
                // Adjust based on your API response structure { data: { token: 'new...', user: {} } }

                if (token) {
                    // Update store
                    api.dispatch(setCredentials({
                        user: user || (api.getState() as any).auth.user, // Keep existing user if not returned
                        token,
                        refreshToken // Keep existing refresh token unless rotated? Usually refresh token is rotated too.
                    }));

                    // Update secure storage
                    // Ideally API returns new refresh token too. If not, re-save old one + new access token.
                    await saveTokens(token, refreshToken);

                    // Retry original request
                    result = await baseQuery(args, api, extraOptions);
                }
            } else {
                console.log('REFRESH_FAILED: Logging out');
                api.dispatch(logout());
                await clearTokens();
            }
        } else {
            console.log('NO_REFRESH_TOKEN: Logging out');
            api.dispatch(logout());
            await clearTokens();
        }
    }

    // Log errors (optional, kept from before)
    if (result.error) {
        console.log('API_ERROR:', JSON.stringify(result.error, null, 2));
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Debate', 'Notification', 'Home', 'Social'],
    endpoints: () => ({}),
});
