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
      },
    ],
  },
});
