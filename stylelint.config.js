const argv = require("yargs").argv;

const glob = argv["_"] && argv["_"][0];

const isJsTsxFiles = glob && /.{js,ts,tsx}/.test(glob);

if (isJsTsxFiles) {
  module.exports = {
    extends: ["stylelint-config-recommended"]
  };
}

module.exports = {
  extends: ["stylelint-config-recommended"],
  processors: [],
  rules: {
    indentation: 2
  }
};
