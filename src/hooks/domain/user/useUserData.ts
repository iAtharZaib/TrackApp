import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import { OfflineQueue } from '@/services/OfflineQueue';
import { UserDataPayload } from '@/hooks/domain/user/types';

const queue = new OfflineQueue<UserDataPayload>();

export const useUserData = () => {
  const [form, setForm] = useState<Partial<UserDataPayload>>({});
  const [syncedData, setSyncedData] = useState<UserDataPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const updateField = (key: keyof UserDataPayload, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: false }));
  };

  const validateForm = () => {
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
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Fill all required fields', position: 'top' });
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
      Toast.show({ type: 'success', text1: 'Success', text2: 'Data sent successfully', position: 'top' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to send data', position: 'top' });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncNow = async () => {
    const pendingRequests = queue.loadRequests();
    if (!pendingRequests || pendingRequests.length === 0) {
      Toast.show({ type: 'info', text1: 'No Pending Requests', text2: 'All data is already synced.', position: 'top' });
      return;
    }

    setLoading(true);
    try {
      const syncedCount = await queue.syncPending('https://jsonplaceholder.typicode.com/posts');
      if (syncedCount > 0) {
        Toast.show({ type: 'success', text1: 'Sync Completed', text2: `${syncedCount} pending request(s) synced`, position: 'top' });
        refreshFromStorage();
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Sync Failed', text2: 'Could not sync pending requests', position: 'top' });
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
    } catch {
      Toast.show({ type: 'error', text1: 'Fetch Failed', text2: 'Could not fetch data', position: 'top' });
    } finally {
      setLoading(false);
    }
  };

  return { form, errors, syncedData, loading, updateField, handleSend, handleSyncNow, handleFetch };
};
