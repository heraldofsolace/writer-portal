/**
 * @type {import('next').NextConfig}
 */

const withTM = require("next-transpile-modules")(["react-markdown"]);

module.exports = withTM({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dl.airtable.com",
        pathname: "/.attachments/**",
      },{
        protocol: "https",
        hostname: "proxy.sequin.io",
        pathname: "/attachment/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/assignments?type=current",
        permanent: true,
      },
    ];
  },
});
