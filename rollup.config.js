const dts = require("rollup-plugin-dts").default;

module.exports = {
    input: "./dist/index.d.ts",
    output: {
        file: "./dist/index.d.ts",
        format: "es",
    },
    plugins: [dts()],
};