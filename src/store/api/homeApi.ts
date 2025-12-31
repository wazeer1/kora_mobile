import { apiSlice } from './apiSlice';

export const homeApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPriorityStack: builder.query({
            query: (params) => ({
                url: '/home/priority-stack',
                params,
            }),
            providesTags: ['Home'],
        }),
        getTimeline: builder.query({
            query: (params) => ({
                url: '/home/timeline',
                params,
            }),
            providesTags: ['Home'],
        }),
        getFeed: builder.query({
            query: (params) => ({
                url: '/home/feed',
                params,
            }),
            providesTags: ['Home'],
        }),
        getTopics: builder.query({
            query: () => '/home/topics',
        }),
    }),
});

export const {
    useGetPriorityStackQuery,
    useGetTimelineQuery,
    useGetFeedQuery,
    useGetTopicsQuery,
} = homeApi;
