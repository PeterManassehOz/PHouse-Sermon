import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/sermons',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const sermonAuthApi = createApi({
  reducerPath: 'sermonAuthApi',
  baseQuery,
  endpoints: (builder) => ({
    createSermon: builder.mutation({
      query: (sermonData) => {
        const formData = new FormData();
        Object.entries(sermonData).forEach(([key, value]) => {
          formData.append(key, value);
        });
        return {
          url: '/',
          method: 'POST',
          body: formData,
        };
      },
    }),
    getAllSermons: builder.query({
      query: () => {
        console.log("Fetching all sermons...");
        return {
          url: '/',
          method: 'GET',
        };
      },
    }),
    getSermonById: builder.query({
      query: (id) => {
        console.log(`Fetching sermon with ID: ${id}`);
        return {
          url: `/${id}`,
          method: 'GET',
        };
      },
    }),
    likeSermon: builder.mutation({
      query: (id) => {
        console.log(`Liking sermon with ID: ${id}`);
        return {
          url: `/${id}/like`,
          method: 'PATCH',
        };
      },
    }),
    incrementView: builder.mutation({
      query: (id) => {
        console.log(`Incrementing view count for sermon ID: ${id}`);
        return {
          url: `/${id}/view`,
          method: 'PATCH',
        };
      },
    }),
   addComment: builder.mutation({
      query: ({ id, text }) => {
        console.log(`Adding comment to sermon ID: ${id}`, { text });
        return {
          url: `/${id}/comment`,
          method: 'POST',
          body: { text },
        };
      },
    }),
    deleteComment: builder.mutation({
      query: ({ sermonId, commentId }) => {
        console.log(`Deleting comment with ID: ${commentId} from sermon ID: ${sermonId}`);
        return {
          url: `/${sermonId}/comment/${commentId}`,
          method: 'DELETE',
        };
      },
    }),
    incrementDownload: builder.mutation({
      query: (id) => {
        console.log(`Incrementing download count for sermon ID: ${id}`);
        return {
          url: `${id}/download`,
          method: 'PATCH',
        };
      },
    }),
    getAggregatedData: builder.query({
      query: () => {
        console.log("Fetching aggregated sermon data...");
        return {
          url: '/aggregated-data',
          method: 'GET',
        };
      },
    }),
    updateSermon: builder.mutation({
      query: ({ id, sermonData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: sermonData, // Keep it as FormData
      }),
    }),    
    deleteSermon: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),    
  }),
});

export const {
  useCreateSermonMutation,
  useGetAllSermonsQuery,
  useGetSermonByIdQuery,
  useLikeSermonMutation,
  useIncrementViewMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useIncrementDownloadMutation,
  useGetAggregatedDataQuery,
  useUpdateSermonMutation,
  useDeleteSermonMutation,
} = sermonAuthApi;
