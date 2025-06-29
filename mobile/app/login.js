import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://192.168.0.15:3001/api/auth/login', {
        email: form.email,
        password: form.password,
      });
      await AsyncStorage.setItem('token', res.data.token);
      router.replace('/');
    } catch (err) {
      Alert.alert('Erro', 'Email ou senha inválidos');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Input placeholder="Email" value={form.email} onChangeText={t => setForm({ ...form, email: t })} autoCapitalize="none" />
      <Input placeholder="Senha" secureTextEntry value={form.password} onChangeText={t => setForm({ ...form, password: t })} />
      <Button title="Entrar" onPress={handleLogin} />

      <Text style={styles.link} onPress={() => router.push('/register')}>
        Não tem uma conta? Registre-se
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#34375a', textAlign: 'center' },
  link: { color: '#34375a', textAlign: 'center', marginTop: 16 }
});