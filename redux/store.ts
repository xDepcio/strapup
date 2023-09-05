import { configureStore } from "@reduxjs/toolkit";
import { configApi } from "./services/configApi";


export const store = configureStore({
    reducer: {
        [configApi.reducerPath]: configApi.reducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat([configApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
