/**
 * @type {import('next').NextConfig}
 */

const { withAxiom } = require("next-axiom");

module.exports = withAxiom({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dl.airtable.com",
        pathname: "/.attachments/**",
      },
      {
        protocol: "https",
        hostname: "proxy.sequin.io",
        pathname: "/attachment/**",
      },
      {
        protocol: "https",
        hostname: "v5.airtableusercontent.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    swcPlugins: [
      [
        "next-superjson-plugin",
        {
          excluded: [],
        },
      ],
    ],
    serverMinification: false,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/assignments/by-type/current",
        permanent: true,
      },
    ];
  },
});
