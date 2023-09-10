import localFont from 'next/font/local'
import { Roboto_Mono } from 'next/font/google'

export const ProximaSoft = localFont({
    src: [
        {
            path: "../public/fonts/proxima-soft/ProximaSoft-Thin.woff2",
            style: "normal",
            weight: "100"
        },
        {
            path: "../public/fonts/proxima-soft/ProximaSoft-Light.woff2",
            style: "normal",
            weight: "300"
        },
        {
            path: "../public/fonts/proxima-soft/ProximaSoft-Regular.woff2",
            style: "normal",
            weight: "400"
        },
        {
            path: "../public/fonts/proxima-soft/ProximaSoft-Medium.woff2",
            style: "normal",
            weight: "500"
        },
        {
            path: "../public/fonts/proxima-soft/ProximaSoft-SemiBold.woff2",
            style: "normal",
            weight: "600"
        },
        {
            path: "../public/fonts/proxima-soft/ProximaSoft-Bold.woff2",
            style: "normal",
            weight: "700"
        },
        {
            path: "../public/fonts/proxima-soft/ProximaSoft-ExtraBold.woff2",
            style: "normal",
            weight: "800"
        },
        {
            path: "../public/fonts/proxima-soft/ProximaSoft-Black.woff2",
            style: "normal",
            weight: "900"
        },
    ]
})

export const robotoMono = Roboto_Mono({
    subsets: ["latin"]
})
