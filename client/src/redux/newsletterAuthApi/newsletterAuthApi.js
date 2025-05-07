import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const newsLetterAuthApi = createApi({
  reducerPath: "newsletterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/newsletter",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token"); // or however you store it
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation({
      query: (email) => ({
        url: "/subscribe",
        method: "POST",
        body: { email },
      }),
    }),
    getSubscriptionStatus: builder.query({
        query: () => ({
          url: "/status",
          method: "GET",
          // no email needed
        }),
      }),
      getAllSubscribers: builder.query({
        query: () => ({
            url: "/all-subscribers",
          method: "GET",
        }),
      }),
  }),
});

export const { useSubscribeNewsletterMutation, useGetSubscriptionStatusQuery, useGetAllSubscribersQuery } = newsLetterAuthApi;
