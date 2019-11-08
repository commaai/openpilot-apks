module.exports = function(api) {
  api.cache(true);

  config = {
    presets: ['module:metro-react-native-babel-preset'],
  };
  if (process.env.NODE_ENV === 'production' || process.env.BABEL_ENV === 'production') {
    config.plugins = ['transform-remove-console'];
  }
  return config;
}
