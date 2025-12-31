import { apiSlice } from './apiSlice';

export const notificationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: () => '/notifications',
            providesTags: ['Notification'],
        }),
        markAllRead: builder.mutation({
            query: () => ({
                url: '/notifications/read',
                method: 'POST',
            }),
            invalidatesTags: ['Notification'],
        }),
        markRead: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: 'PUT',
            }),
            invalidatesTags: ['Notification'],
        }),
        respondNotification: builder.mutation({
            query: ({ id, action }) => ({
                url: `/notifications/${id}/respond`,
                method: 'POST',
                body: { action },
            }),
            invalidatesTags: ['Notification', 'Home', 'Debate'],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkAllReadMutation,
    useMarkReadMutation,
    useRespondNotificationMutation,
} = notificationsApi;
