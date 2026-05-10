module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '@react-native|' +
      'react-native|' +
      '@react-navigation|' +
      'react-native-safe-area-context|' +
      '@react-native-async-storage|' +
      '@react-native-community' +
    ')/)',
  ],
  moduleNameMapper: {
    '@react-native-async-storage/async-storage':
      '@react-native-async-storage/async-storage/jest/async-storage-mock',
    '@react-native-community/netinfo':
      '__mocks__/@react-native-community/netinfo.js',
  },
};
