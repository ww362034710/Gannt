module.exports = {
  compact: false,
  presets: [
    "@babel/preset-env",
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ]
}
