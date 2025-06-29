import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function MobileExpenses() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('http://192.168.0.15:3001/api/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data);
    };
    fetchExpenses();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saídas</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.label}>{item.description}</Text>
            <Text style={styles.value}>R$ {parseFloat(item.amount).toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#34375a', marginBottom: 16 },
  item: {
    backgroundColor: '#f3f3f3',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },
  label: { fontSize: 16 },
  value: { fontSize: 16, fontWeight: 'bold', color: '#34375a', textAlign: 'right' }
});