import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5', // light background
    paddingBottom: 40, // extra bottom spacing
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: '700',
    marginBottom: 6,
    color: '#333',
  },
  card: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noInternetContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    zIndex: 1000,
  },
  noInternetText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
