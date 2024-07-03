const path = require("path");
console.log("process.env.NODE_ENV",process.env.NODE_ENV);
module.exports = {
  publicPath: "./",
  outputDir: path.resolve(
    __dirname,
    process.env.NODE_ENV === "production"
      ? "./dist-prod"
      : process.env.NODE_ENV === "test"
      ? "./dist-test"
      : process.env.NODE_ENV === "ppt"
      ? "./dist-ppt"
      : "./dist-dev"
  ),
  assetsDir: "static",
  indexPath: "index.html",
  productionSourceMap: false, // 生产环境的 source map
  lintOnSave: false,
  configureWebpack: {
    performance: {
      hints: false
    }
  },
  css: {
    loaderOptions: {
      less: {
        // 修改基本的配色信息
        // 具体信息参考 https://youzan.github.io/vant/#/zh-CN/theme
        javascriptEnabled: true,
        modifyVars: {
          // blue: "#ff6700",
          // green: "#B51A1A",
          "text-color": "#111"
        }
      },
      sass: {
        data: `
          @import "@/assets/sass/common.scss";
        `
      }
    },
    extract: true,

    // 是否开启 CSS source map？
    sourceMap: false,
    // 为所有的 CSS 及其预处理文件开启 CSS Modules。
    // 这个选项不会影响 `*.vue` 文件。
    modules: false
  }
};
console.log("process.env.NODE_ENV", process.env.NODE_ENV);
