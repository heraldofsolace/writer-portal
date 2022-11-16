/**
 * @type {import('next').NextConfig}
 */

const withTM = require("next-transpile-modules")(["react-markdown"]);
const { withAxiom } = require("next-axiom");

module.exports = withTM(
  withAxiom({
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
    async redirects() {
      return [
        {
          source: "/",
          destination: "/assignments?type=current",
          permanent: true,
        },
      ];
    },
  })
);
