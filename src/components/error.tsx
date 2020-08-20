import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface ErrorProps {
  message: string;
}

export const Error: React.FunctionComponent<ErrorProps> = ({ message }) => (
  <View style={styles.container}>
    <Text style={styles.errorText}>Error</Text>
    <Text style={styles.messageText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#143672',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 40,
    color: 'red',
    padding: 15,
  },
  messageText: {
    fontSize: 36,
    color: 'white',
  },
});
