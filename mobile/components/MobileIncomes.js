import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function MobileIncomes() {
  const [incomes, setIncomes] = useState([]);

  useEffect(() => {
    const fetchIncomes = async () => {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('http://192.168.0.15:3001/api/incomes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncomes(res.data);
    };
    fetchIncomes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entradas</Text>
      <FlatList
        data={incomes}
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
