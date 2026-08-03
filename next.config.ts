import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            // Allow uploads up to 10 MB (plus some form-field overhead).
            // The server action itself enforces the 10 MB file limit.
            bodySizeLimit: "11mb",
        },
    },
};

export default nextConfig;
