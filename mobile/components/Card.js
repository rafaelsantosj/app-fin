import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Card({ label, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f3f3f3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },
  label: { fontSize: 16, color: '#000' },
  value: { fontSize: 18, fontWeight: 'bold', color: '#34375a' }
});