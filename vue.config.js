/* eslint @typescript-eslint/no-var-requires: off */

const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("./src"))
      .set("components", resolve("./src/components"))
      .set("assets", resolve("./src/assets"))
      .set("utils", resolve("./src/utils"));
  },
};
