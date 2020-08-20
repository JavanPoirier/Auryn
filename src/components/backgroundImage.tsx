import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

type BackgroundImageProps = {
  source: string;
};

export const BackgroundImage: React.FunctionComponent<BackgroundImageProps> = ({ source, children }) => (
  <View style={styles.container}>
    <Image style={styles.background} source={{ uri: source }} />
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
  },
});
