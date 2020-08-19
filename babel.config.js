module.exports = {
  plugins: [
    ['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
  ],
  presets: ['module:metro-react-native-babel-preset'],
};
