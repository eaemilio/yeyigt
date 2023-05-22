module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'supabase-cdn.vercel.app', 'fcriikwtewdpzbifahnv.supabase.co'],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};
