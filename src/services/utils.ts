import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export async function requestLocationPermission() {
  let permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  const status = await check(permission);
  if (status === RESULTS.GRANTED) {
    return true;
  }
  if (status === RESULTS.DENIED) {
    const req = await request(permission);
    return req === RESULTS.GRANTED;
  }
  if (status === RESULTS.BLOCKED) {
    return false; // blocked → redirect user back
  }
  return false;
}


export const GOOGLE_API_KEY='AIzaSyDspWK0GtRLhXv3uOM-SdM02ZxVDM5fQaY'; 