import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ 
  baseUrl: 'http://localhost:5000/admin',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const adminAuthApi = createApi({
    reducerPath: 'adminAuthApi',
    baseQuery,
    endpoints: (builder) => ({
      loginAdmin: builder.mutation({
        query: (userData) => ({
          url: '/login',
          method: 'POST',
          body: userData,
        }),
      }),
      registerAdmin: builder.mutation({
        query: (userData) => ({
          url: '/register',
          method: 'POST',
          body: userData,
        }),
      }),
    }),
  });

export const { useLoginAdminMutation, useRegisterAdminMutation } = adminAuthApi;