import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import { terser } from "rollup-plugin-terser";
import license from "rollup-plugin-license";
import { name, version, main, module, browser, author } from "./package.json";

const isProduction = process.env.NODE_ENV === "production";

const settings = {
  globals: {
    ms: "ms",
  },
};

export default {
  input: "./src/index.ts",
  output: [
      {
      file: main,
      name: main,
      ...settings,
      format: 'cjs',
      plugins: [
        isProduction && terser()
      ]
    },
  ],
  external: ["ms"],

  plugins: [
    json(),
    resolve({
      jsnext: true,
      main: true,
    }),
    typescript({
      typescript: require("typescript"),
    }),
    commonjs({
      include: "node_modules/**",
      extensions: [".js"],
      ignoreGlobal: false,
      sourceMap: false,
      namedExports: {
        "node_modules/lodash/lodash.js": [
          "isNil",
          "isEmpty"
        ],
      },
    }),
  ],
};


// // rollup.config.js
// import resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';

// export default {
//   input: 'main.js',
//   output: {
//     file: 'bundle.js',
//     format: 'iife',
//     name: 'MyModule'
//   },
//   plugins: [commonjs(), resolve()]
// };

// export default {
//   input: "./src/index.ts",
//   output: {
//     file: 'bundle.js',
//     format: 'iife',
//     name: 'MyModule'
//   },
//   plugins: [typescript({
//          typescript: require("typescript"),
//         }),commonjs(), resolve()]
// };