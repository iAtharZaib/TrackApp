import React from 'react';
import { Modal, View, ActivityIndicator } from 'react-native';
import { styles } from '@/screens/UserData/styles';

interface Props {
  visible: boolean;
}

export const Loader: React.FC<Props> = ({ visible }) => (
  <Modal transparent visible={visible}>
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  </Modal>
);
