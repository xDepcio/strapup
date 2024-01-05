'use client'

import { SessionProvider } from "next-auth/react";
import ThemeProvider from "./ThemeProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </QueryClientProvider>
        </ThemeProvider>
    )
}
