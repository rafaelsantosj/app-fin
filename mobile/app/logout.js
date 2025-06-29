import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await AsyncStorage.removeItem('token');
      router.replace('/login');
    };
    logout();
  }, []);

  return null;
}