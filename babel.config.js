module.exports = {
  plugins: [
    ['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
    'module:@youi/babel-plugin-react-native-youi',
  ],
  presets: ['module:metro-react-native-babel-preset'],
};
