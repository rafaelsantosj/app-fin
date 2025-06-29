import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await axios.post('http://192.168.0.15:3001/api/auth/register', form);
      Alert.alert('Sucesso', 'Conta criada com sucesso');
      router.replace('/login');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível registrar');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <TextInput placeholder="Nome" value={form.name} onChangeText={t => setForm({ ...form, name: t })} style={styles.input} />
      <TextInput placeholder="Email" value={form.email} onChangeText={t => setForm({ ...form, email: t })} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Senha" secureTextEntry value={form.password} onChangeText={t => setForm({ ...form, password: t })} style={styles.input} />
      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#34375a', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 8 }
});