import {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';
import { enableLocationSuccess } from '../../redux/locationSlice';

const useGeolocation = () => {
  const [currentLongitude, setCurrentLongitude] = useState<number>();
  const [currentLatitude, setCurrentLatitude] = useState<number>();
  const [locationStatus, setLocationStatus] = useState<string>('');
  let watchID: number | null = null; // Keep track of the subscription ID

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationUpdates();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            const checkEnabled: boolean = await isLocationEnabled();
            if (!checkEnabled) {
              const enableResult = await promptForEnableLocationIfNeeded();
              console.log('enableResult', enableResult);
            }
            getOneTimeLocation();
            subscribeLocationUpdates();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestLocationPermission();

    return () => {
      if (watchID) {
        Geolocation.clearWatch(watchID);
      }
    };
  }, []);

  const getOneTimeLocation = () => {
    setLocationStatus('searching');
    Geolocation.getCurrentPosition(
      position => {
        setLocationStatus('You are Here');
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        setCurrentLongitude(longitude);
        setCurrentLatitude(latitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const subscribeLocationUpdates = () => {
    watchID = Geolocation.watchPosition(
      position => {
        setLocationStatus('You are Here');
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        setCurrentLongitude(longitude);
        setCurrentLatitude(latitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Trigger updates for every 1 meter change
      },
    );
  };

  return {
    currentLongitude,
    currentLatitude,
    locationStatus,
    getOneTimeLocation,
  };
};

export default useGeolocation;
