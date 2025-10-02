import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import {UserDataPayload} from '@/hooks/domain/user/types';
import { styles } from '@/screens/UserData/styles';
import { useTheme } from '@/theme';

interface Props {
  form: Partial<UserDataPayload>;
  errors: Record<string, boolean>;
  updateField: (key: keyof UserDataPayload, value: string) => void;
  onSend: () => void;
  onSync: () => void;
  onFetch: () => void;
  loading: boolean;
}

export const UserDataForm: React.FC<Props> = ({ form, errors, updateField, onSend, onSync, onFetch, loading }) => {
  const { fonts } = useTheme();
  const inputStyle = (field: keyof UserDataPayload) => [styles.input, errors[field] ? { borderColor: 'red', borderWidth: 1 } : {}];

  return (
    <View>
      <Text style={[styles.label, fonts.bold]}>ID (Optional)</Text>
      <TextInput style={inputStyle('id')} placeholder="Enter ID" keyboardType="numeric" value={form.id?.toString() || ''} onChangeText={val => updateField('id', val)} />

      <Text style={[styles.label, fonts.bold]}>Name</Text>
      <TextInput style={inputStyle('name')} placeholder="Enter Name" value={form.name || ''} onChangeText={val => updateField('name', val)} />

      <Text style={[styles.label, fonts.bold]}>Merchant Name</Text>
      <TextInput style={inputStyle('merchantName')} placeholder="Enter Merchant Name" value={form.merchantName || ''} onChangeText={val => updateField('merchantName', val)} />

      <Text style={[styles.label, fonts.bold]}>Latitude</Text>
      <TextInput style={inputStyle('latitude')} placeholder="Enter Latitude" keyboardType="numeric" value={form.latitude || ''} onChangeText={val => updateField('latitude', val)} />

      <Text style={[styles.label, fonts.bold]}>Longitude</Text>
      <TextInput style={inputStyle('longitude')} placeholder="Enter Longitude" keyboardType="numeric" value={form.longitude || ''} onChangeText={val => updateField('longitude', val)} />

      <Text style={[styles.label, fonts.bold]}>Address</Text>
      <TextInput style={inputStyle('address')} placeholder="Enter Address" value={form.address || ''} onChangeText={val => updateField('address', val)} />

      <View style={styles.buttonContainer}>
        <Button title="Send Data" onPress={onSend} disabled={loading} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Sync Pending Data" onPress={onSync} disabled={loading} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Fetch Posted Data" onPress={onFetch} disabled={loading} />
      </View>
    </View>
  );
};
