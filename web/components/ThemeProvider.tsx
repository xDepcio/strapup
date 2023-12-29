'use client'

import { ThemeProvider as NextThemeProvider } from "next-themes"

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <NextThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>

                {children}
            </NextThemeProvider>
        </NextThemeProvider>
    )
}
