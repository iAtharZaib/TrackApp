import React from 'react';
import { ScrollView } from 'react-native';
import { SafeScreen } from '@/components/templates';
import { useUserData } from '@/hooks/domain/user/useUserData';

import { styles } from './styles';
import { UserDataForm } from '@/components/molecules/UserDataForm/UserDataForm';
import { UserDataList } from '@/components/molecules/UserDataForm/UserDataList';
import { Loader } from '@/components/molecules/UserDataForm/Loader';

export default function UserData() {
  const { form, errors, syncedData, loading, updateField, handleSend, handleSyncNow, handleFetch } = useUserData();

  return (
    <SafeScreen style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: 80 }]}>
        <UserDataForm form={form} errors={errors} updateField={updateField} onSend={handleSend} onSync={handleSyncNow} onFetch={handleFetch} loading={loading} />
        <UserDataList data={syncedData} />
      </ScrollView>
      <Loader visible={loading} />
    </SafeScreen>
  );
}
