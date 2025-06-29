import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function MobileDashboard() {
  const [data, setData] = useState({ income: 0, expense: 0 });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const res = await axios.get('http://192.168.0.15:3001/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (error) {
        router.replace('/login');
      }
    };

    fetchData();
  }, []);

  const cards = [
    { title: 'Entradas', value: data.income, route: '/incomes' },
    { title: 'Saídas', value: data.expense, route: '/expenses' },
    { title: 'Saldo', value: data.income - data.expense, route: '/' },
    { title: 'Funcionários', value: '', route: '/employees' }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Resumo Financeiro</Text>
      {cards.map((card, idx) => (
        <TouchableOpacity key={idx} onPress={() => router.push(card.route)} style={styles.card}>
          <Text style={styles.label}>{card.title}</Text>
          <Text style={styles.value}>
            {card.value !== '' ? `R$ ${parseFloat(card.value).toFixed(2)}` : 'Ver'}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#34375a' },
  card: {
    backgroundColor: '#f3f3f3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },
  label: { fontSize: 16, color: '#000' },
  value: { fontSize: 18, fontWeight: 'bold', color: '#34375a' }
});