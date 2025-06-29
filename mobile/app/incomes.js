import React from 'react';
import { View, StyleSheet } from 'react-native';
import MobileIncomes from '../components/MobileIncomes';

export default function IncomesPage() {
  return (
    <View style={styles.container}>
      <MobileIncomes />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' }
});