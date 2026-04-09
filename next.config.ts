import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/referrals",
        destination: "/referral",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
