const path = require("path");

const nextConfig = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, "components")],
    },
    webpack(config) {
        // удаляем стандартный обработчик svg
        const fileLoaderRule = config.module.rules.find((rule) =>
            rule.test?.test?.('.svg')
        );
        fileLoaderRule.exclude = /\.svg$/i;

        // добавляем svgr
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
}
module.exports = nextConfig;