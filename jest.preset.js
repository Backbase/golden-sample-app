const nxPreset = require('@nrwl/jest/preset');

// Fix for Angular 12 and ESM
// https://github.com/thymikee/jest-preset-angular/issues/1465#issuecomment-1123659574
// https://thymikee.github.io/jest-preset-angular/docs/guides/esm-support/#use-esm-presets

const { compilerOptions } = require('./tsconfig.base.json');
const ngPreset = require('jest-preset-angular/presets');
const projectMaps = {};

for (const [name, paths] of Object.entries(compilerOptions.paths)) {
  projectMaps[name] = paths.map((p) => require.resolve(`./${p}`));
}

const options = {
  ...nxPreset,
  ...ngPreset.defaultsESM,
  moduleNameMapper: {
    ...projectMaps,
  },
};

module.exports = options;
