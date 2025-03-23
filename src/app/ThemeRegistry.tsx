"use client"; // Mark as client component

import { ReactNode, useState, useEffect } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

// Create Emotion cache to prevent hydration issues
const cache = createCache({ key: "mui", prepend: true });

// Create a default MUI theme (you can customize it)
const theme = createTheme();

export default function ThemeRegistry({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true); // Ensures consistent rendering on client
    }, []);

    if (!mounted) return null; // Prevents SSR/client mismatch

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline /> {/* Ensures consistent baseline styling */}
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
}
