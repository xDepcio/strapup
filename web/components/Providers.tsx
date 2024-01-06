'use client'

import { SessionProvider } from "next-auth/react";
import ThemeProvider from "./ThemeProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, useState } from "react";
import { SearchResBody } from "@/app/api/search/route";

const queryClient = new QueryClient()

type SearchContextType = {
    data: SearchResBody
    isLoading: boolean
    setData: (data: SearchResBody) => void
    setLoading: (loading: boolean) => void
}
export const SearchContext = createContext<SearchContextType>({
    data: {
        scripts: [],
        templates: [],
    },
    isLoading: false,
    setData: (data: SearchResBody) => { },
    setLoading: (loading: boolean) => { },
})

export default function Providers({ children }: { children: React.ReactNode }) {
    const [searchRes, setSearchRes] = useState<SearchResBody>({
        scripts: [],
        templates: [],
    })
    const [searchLoading, setSearchLoading] = useState<boolean>(false)

    return (
        <SearchContext.Provider value={{ data: searchRes, setData: setSearchRes, setLoading: setSearchLoading, isLoading: searchLoading }}>
            <ThemeProvider>
                <QueryClientProvider client={queryClient}>
                    <SessionProvider>
                        {children}
                    </SessionProvider>
                </QueryClientProvider>
            </ThemeProvider>
        </SearchContext.Provider>
    )
}
