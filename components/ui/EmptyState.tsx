import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmptyState = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No items in your shopping list.</Text>
      <Text style={styles.text}>Add some items to get started!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});

export default EmptyState;