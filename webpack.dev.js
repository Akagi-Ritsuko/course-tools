const merge = require("webpack-merge");
const common = require("./webpack.config.js");

// webpack.config.js 导出双目录多编译器数组,dev 模式对每个配置叠加 watch
module.exports = common.map((config) => merge(config, {
    watch: true,
}));
