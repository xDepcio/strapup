"use client";

import { SetStateAction, createContext, useContext, useState } from "react";
import { store } from "./store";
import { Provider } from "react-redux";
import { boolean } from "zod";

export const LoadingContext = createContext({ loading: false, setloading: () => false } as { loading: boolean, setloading: (value: SetStateAction<boolean>) => void });

export function Providers({ children }: { children: React.ReactNode }) {
    const [loading, setloading] = useState<boolean>(false);

    return (
        <LoadingContext.Provider value={{ loading, setloading }}>
            <Provider store={store}>
                {children}
            </Provider>
        </LoadingContext.Provider>
    );
}
