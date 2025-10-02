import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  View,
  Button,
  FlatList,
  Modal,
  ActivityIndicator,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { OfflineQueue } from '@/services/OfflineQueue';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { SafeScreen } from '@/components/templates';
import { useTheme } from '@/theme';
import moment from 'moment';
import { styles } from './styles';

export interface UserDataPayload {
  id: number;
  name: string;
  merchantName: string;
  latitude: string;
  longitude: string;
  address: string;
  dateTime: string;
}

const queue = new OfflineQueue<UserDataPayload>();

function UserData({ navigation }: RootScreenProps<Paths.UserData>) {
  const { fonts, gutters, layout, colors } = useTheme();
  const [form, setForm] = useState<Partial<UserDataPayload>>({});
  const [syncedData, setSyncedData] = useState<UserDataPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const updateField = (key: keyof UserDataPayload, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: false }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (!form.name) newErrors.name = true;
    if (!form.merchantName) newErrors.merchantName = true;
    if (!form.latitude) newErrors.latitude = true;
    if (!form.longitude) newErrors.longitude = true;
    if (!form.address) newErrors.address = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const refreshFromStorage = () => {
    const storedData = queue.getAllStored();
    if (storedData && storedData.length > 0) setSyncedData(storedData);
  };

  useEffect(() => {
    refreshFromStorage();
  }, []);

  const handleSend = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all required fields',
        position: 'top',
      });
      return;
    }

    const data: UserDataPayload = {
      id: Number(form.id) || Date.now(),
      name: form.name!,
      merchantName: form.merchantName!,
      latitude: form.latitude!,
      longitude: form.longitude!,
      address: form.address!,
      dateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    setLoading(true);
    try {
      await queue.sendOrQueue('https://jsonplaceholder.typicode.com/posts', data);
      refreshFromStorage();
      setForm({});
      setErrors({});
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Data sent successfully',
        position: 'top',
      });
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send data',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncNow = async () => {
    const pendingRequests = queue.loadRequests();
    if (!pendingRequests || pendingRequests.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'No Pending Requests',
        text2: 'All data is already synced.',
        position: 'top',
      });
      return;
    }

    setLoading(true);
    try {
      const syncedCount = await queue.syncPending('https://jsonplaceholder.typicode.com/posts');
      if (syncedCount > 0) {
        Toast.show({
          type: 'success',
          text1: 'Sync Completed',
          text2: `${syncedCount} pending request(s) synced successfully`,
          position: 'top',
        });
        refreshFromStorage();
      }
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: 'Sync Failed',
        text2: 'Could not sync pending requests',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts');
      const json = await res.json();
      setSyncedData(json.slice(0, 5));
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: 'Fetch Failed',
        text2: 'Could not fetch data',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-sync on internet reconnect
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async state => {
      if (state.isConnected) {
        const pendingRequests = queue.loadRequests();
        if (!pendingRequests || pendingRequests.length === 0) return;

        const syncedCount = (await queue.syncPending('https://jsonplaceholder.typicode.com/posts')) ?? 0;
        if (syncedCount > 0) {
          Toast.show({
            type: 'success',
            text1: 'Auto Sync Completed',
            text2: `${syncedCount} pending request(s) synced successfully`,
            position: 'top',
          });
          refreshFromStorage();
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const inputStyle = (field: keyof UserDataPayload) => [
    styles.input,
    errors[field] ? { borderColor: colors.red500, borderWidth: 1 } : {},
  ];

  return (
    <SafeScreen style={layout.flex_1}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: 40 }]}>
        <Text style={[styles.label, fonts.bold]}>ID (Optional)</Text>
        <TextInput
          style={inputStyle('id')}
          placeholder="Enter ID"
          keyboardType="numeric"
          value={form.id?.toString() || ''}
          onChangeText={val => updateField('id', val)}
        />

        <Text style={[styles.label, fonts.bold]}>Name</Text>
        <TextInput
          style={inputStyle('name')}
          placeholder="Enter Name"
          value={form.name || ''}
          onChangeText={val => updateField('name', val)}
        />

        <Text style={[styles.label, fonts.bold]}>Merchant Name</Text>
        <TextInput
          style={inputStyle('merchantName')}
          placeholder="Enter Merchant Name"
          value={form.merchantName || ''}
          onChangeText={val => updateField('merchantName', val)}
        />

        <Text style={[styles.label, fonts.bold]}>Latitude</Text>
        <TextInput
          style={inputStyle('latitude')}
          placeholder="Enter Latitude"
          keyboardType="numeric"
          value={form.latitude || ''}
          onChangeText={val => updateField('latitude', val)}
        />

        <Text style={[styles.label, fonts.bold]}>Longitude</Text>
        <TextInput
          style={inputStyle('longitude')}
          placeholder="Enter Longitude"
          keyboardType="numeric"
          value={form.longitude || ''}
          onChangeText={val => updateField('longitude', val)}
        />

        <Text style={[styles.label, fonts.bold]}>Address</Text>
        <TextInput
          style={inputStyle('address')}
          placeholder="Enter Address"
          value={form.address || ''}
          onChangeText={val => updateField('address', val)}
        />

        <View style={styles.buttonContainer}>
          <Button title="Send Data" onPress={handleSend} disabled={loading} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Sync Pending Data" onPress={handleSyncNow} disabled={loading} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Fetch Posted Data" onPress={handleFetch} disabled={loading} />
        </View>

        <FlatList
          data={syncedData}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>ID: {item.id}</Text>
              <Text>Name: {item.name}</Text>
              <Text>Merchant: {item.merchantName}</Text>
              <Text>Address: {item.address}</Text>
              <Text>Lat/Lng: {item.latitude}, {item.longitude}</Text>
              <Text>Date: {item.dateTime}</Text>
            </View>
          )}
        />
      </ScrollView>

      {/* Full-screen loader */}
      <Modal transparent visible={loading}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </Modal>
    </SafeScreen>
  );
}

export default UserData;
