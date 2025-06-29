import React from 'react';
import { View, StyleSheet } from 'react-native';
import MobileEmployees from '../components/MobileEmployees';

export default function EmployeesPage() {
  return (
    <View style={styles.container}>
      <MobileEmployees />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' }
});