module.exports = {
  presets: [['@babel/preset-env', { useBuiltIns: 'usage', corejs: 2 }], '@babel/preset-typescript'],
  plugins: ['@babel/plugin-proposal-class-properties'],
};
