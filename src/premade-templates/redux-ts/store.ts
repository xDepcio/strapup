import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import scrapedProductReducer from "./features/scrapedProductSlice";
import generatedCategoryReducer from "./features/generatedCategorySlice";
import { descriptionApi } from "./services/descriptionApi";
import descriptionReducer from "./features/descriptionSlice";
import { postOfferApi } from "./services/postOfferApi";
import productOtherInfoReducer from './features/otherProductInfoSlice'


export const store = configureStore({
    reducer: {
        counterReducer,
        scrapedProductReducer,
        generatedCategoryReducer,
        descriptionReducer,
        productOtherInfoReducer,
        [descriptionApi.reducerPath]: descriptionApi.reducer,
        [postOfferApi.reducerPath]: postOfferApi.reducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat([descriptionApi.middleware, postOfferApi.middleware]),
});

// (window as any).store = store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
