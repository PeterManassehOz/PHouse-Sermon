import { configureStore } from '@reduxjs/toolkit'
import activeComponentSlice from './activeComponentSlice'
import profileReducer from './profileSlice'; // Import the profile reducer
import { userAuthApi } from './userAuthApi';
import { profileUpdateApi } from './profileUpdateApi';
import { sermonAuthApi } from './sermonsAttribute/sermonAuthApi';
import { adminAuthApi } from './adminAttribute/adminAuthApi';
import { newsLetterAuthApi } from './newsletterAuthApi/newsletterAuthApi';

export const store = configureStore({
    reducer: {
        activeComponent: activeComponentSlice,
        profile: profileReducer, // Add the profile reducer
        [userAuthApi.reducerPath]: userAuthApi.reducer,
        [profileUpdateApi.reducerPath]: profileUpdateApi.reducer,
        [sermonAuthApi.reducerPath]: sermonAuthApi.reducer,
        [adminAuthApi.reducerPath]: adminAuthApi.reducer,
        [newsLetterAuthApi.reducerPath]: newsLetterAuthApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userAuthApi.middleware, profileUpdateApi.middleware, sermonAuthApi.middleware, adminAuthApi.middleware, newsLetterAuthApi.middleware),
});