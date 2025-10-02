import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
  Alert,
  Linking,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { MMKV } from 'react-native-mmkv';
import { useNavigation } from '@react-navigation/native';
import { SafeScreen } from '@/components/templates';
import { useTheme } from '@/theme';
import { IconByVariant } from '@/components/atoms';
import { GOOGLE_API_KEY, requestLocationPermission } from '@/services/utils';
import { createStyles } from './styles';


// Init MMKV
const storage = new MMKV();

// Init Geocoder
Geocoder.init(`${GOOGLE_API_KEY}`);

function MapScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState({
    latitude: 25.276987,
    longitude: 55.296249,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [address, setAddress] = useState('');
  const [searchText, setSearchText] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [tempLocation, setTempLocation] = useState({
    latitude: 25.276987,
    longitude: 55.296249,
    address: '',
  });

  // Reverse geocode
  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const res = await Geocoder.from(lat, lng);
      const formattedAddress = res.results[0]?.formatted_address || '';
      setAddress(formattedAddress);
      setTempLocation({ latitude: lat, longitude: lng, address: formattedAddress });
    } catch (err) {
      console.log(err);
    }
  };

  // Center map on current location
  const centerOnCurrentLocation = async () => {
    const granted = await requestLocationPermission();
    if (!granted) {
      Alert.alert(
        'Permission Required',
        'Please enable location permission to continue.',
        [{ text: 'Go to Settings', onPress: () => Linking.openSettings() },
        { text: 'Cancel', onPress: () => navigation.goBack(), style: 'cancel' }]
      );
      return;
    }

    Geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        const newRegion = { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 500);
        getAddressFromCoords(latitude, longitude);
      },
      error => {
        console.log(error);
        Alert.alert('Error', 'Unable to fetch current location.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    centerOnCurrentLocation();
  }, []);

  // Manual Google Places autocomplete
  const fetchPlaces = async (input: string) => {
    if (!input) return setPredictions([]);
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_API_KEY}&language=en`
      );
      const data = await res.json();
      setPredictions(data.predictions || []);
    } catch (err) {
      console.log(err);
    }
  };

  const selectPlace = async (placeId: string) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_API_KEY}&language=en`
      );
      const data = await res.json();
      const location = data.result.geometry.location;
      const newRegion = { ...region, latitude: location.lat, longitude: location.lng };
      setRegion(newRegion);
      mapRef.current?.animateToRegion({ ...newRegion, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 500);
      getAddressFromCoords(location.lat, location.lng);
      setSearchText('');
      setPredictions([]);
      Keyboard.dismiss();
    } catch (err) {
      console.log(err);
    }
  };

  // Save location
  const updateLocation = () => {
    storage.set('userLocation', JSON.stringify(tempLocation));
    Alert.alert('Success', 'Location successfully saved.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeScreen>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search location"
          placeholderTextColor={colors.gray400}
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
            fetchPlaces(text);
          }}
          style={styles.searchInput}
        />
        {predictions.length > 0 && (
          <FlatList
            data={predictions}
            keyExtractor={item => item.place_id}
            style={styles.predictionList}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectPlace(item.place_id)} style={styles.predictionItem}>
                <Text style={{ color: colors.white }}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Map */}
     <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={region}
      onRegionChangeComplete={newRegion => {
        // Update marker to center of map
        setRegion(newRegion);
        getAddressFromCoords(newRegion.latitude, newRegion.longitude);
      }}
    >
      {/* Marker at center */}
      <Marker
        coordinate={{ latitude: region.latitude, longitude: region.longitude }}
      />
    </MapView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={centerOnCurrentLocation}>
        <IconByVariant height={42} path="fire" stroke={colors.red500} width={42} />
      </TouchableOpacity>

      {/* Address Box */}
      {tempLocation.address && 
      <View style={styles.addressBox}>
         <Text style={{ color: colors.white, fontWeight:'bold', textDecorationLine: 'underline'}} >Your Current Location</Text>
        <Text style={{ color: colors.white }} numberOfLines={2}>
          {tempLocation.address || 'Pick a location'}
        </Text>
      </View>
      }

      {/* Update Location Button */}
      <TouchableOpacity style={styles.updateButton} onPress={updateLocation}>
        <Text style={{ color: colors.white, fontWeight: 'bold' }}>Update Location</Text>
      </TouchableOpacity>
    </SafeScreen>
  );
}

export default MapScreen;
