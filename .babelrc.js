module.exports = {
  presets: [['@babel/preset-env', { useBuiltIns: 'usage' }], '@babel/preset-typescript'],
  plugins: ['@babel/plugin-proposal-class-properties'],
};
