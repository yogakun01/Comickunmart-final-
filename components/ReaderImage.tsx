import React from 'react';
import { Image, StyleSheet } from 'react-native';

type Props = { uri: string };
export const ReaderImage: React.FC<Props> = ({ uri }) => (
  <Image source={{ uri }} style={styles.image} />
);

const styles = StyleSheet.create({
  image: { width: '100%', height: 500, resizeMode: 'contain', backgroundColor: '#000' },
});