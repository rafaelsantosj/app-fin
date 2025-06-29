import React from 'react';
import { View, StyleSheet } from 'react-native';
import MobileExpenses from '../components/MobileExpenses';

export default function ExpensesPage() {
  return (
    <View style={styles.container}>
      <MobileExpenses />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' }
});