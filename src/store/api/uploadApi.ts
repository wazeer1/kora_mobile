import { apiSlice } from './apiSlice';

export const uploadApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        uploadImage: builder.mutation({
            query: (formData) => ({
                url: '/upload',
                method: 'POST',
                body: formData,
                // Content-Type header is explicitly removed to let browser/native set multipart/boundary
                // But fetchBaseQuery wrapper might need explicit headers management for FormData if it doesn't auto-detect.
                // Usually, RTK Query handles FormData correctly by not setting Content-Type if body is FormData.
            }),
        }),
    }),
});

export const { useUploadImageMutation } = uploadApi;
