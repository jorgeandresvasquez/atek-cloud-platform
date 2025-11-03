module.exports = {
  extends: ["../../.eslintrc.cjs"],
  parserOptions: { project: ["./tsconfig.json", "./tsconfig.eslint.json"] },
  env: { node: true, es2022: true }
};
