/** @type {import('next').NextConfig} */
const { withContentlayer } = require('next-contentlayer')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
}

module.exports = withBundleAnalyzer(withContentlayer({
    ...nextConfig,
    images: {
        remotePatterns: [
            {
                hostname: 'avatars.githubusercontent.com',
            }
        ]
    }
}))
