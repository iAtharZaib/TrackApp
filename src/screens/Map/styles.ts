import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) =>
  StyleSheet.create({
    map: { flex: 1 },

    fab: {
      position: 'absolute',
      bottom: 250,
      right: 10,
      backgroundColor: '#fff',
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 6,
      zIndex: 10,
    },

    addressBox: {
      position: 'absolute',
      bottom: 160,
      left: 20,
      right: 20,
      padding: 12,
      borderRadius: 8,
      elevation: 4,
      backgroundColor: colors.gray800,
      zIndex: 10,
    },

    searchContainer: {
      position: 'absolute',
      top: 10,
      width: '100%',
      zIndex: 20,
      paddingHorizontal: 10,
      backgroundColor: colors.gray900,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },

    searchInput: {
      padding: 10,
      borderRadius: 8,
      backgroundColor: colors.gray800,
      color: colors.white,
      marginTop:40
    },

    predictionList: {
      marginTop: 2,
      maxHeight: 200,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.gray700,
      backgroundColor: colors.gray800,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },

    predictionItem: {
      padding: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.gray700,
    },

    updateButton: {
      position: 'absolute',
      bottom: 80,
      left: 20,
      right: 20,
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: colors.purple500,
      zIndex: 10,
    },
  });
