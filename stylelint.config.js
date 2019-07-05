const argv = require("yargs").argv;

const glob = argv["_"] && argv["_"][0];

const isJsTsxFiles = glob && /.{js,jsx,tsx}/.test(glob);

if (isJsTsxFiles) {
  module.exports = {
    extends: [
      "stylelint-config-recommended",
      "stylelint-config-styled-components"
    ],
    processors: ["stylelint-processor-styled-components"]
  };
}

module.exports = {
  extends: ["stylelint-config-recommended"],
  processors: [],
  rules: {
    indentation: 2
  }
};
