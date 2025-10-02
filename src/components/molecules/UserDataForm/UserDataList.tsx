import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { UserDataPayload } from '@/hooks/domain/user/types';
import { styles } from '@/screens/UserData/styles';

interface Props {
  data: UserDataPayload[];
}

export const UserDataList: React.FC<Props> = ({ data }) => {
  return (
    <FlatList
      data={data}
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
  );
};
