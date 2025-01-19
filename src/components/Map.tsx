import {Image, Pressable, StatusBar, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import tw from 'twrnc';
import useDarkMode from '../hooks/useDarkMode';
import MapView, {Callout, Marker, Polyline} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import axios from 'axios';
import {
  changerefreshstate,
  dropOffLocationSuccess,
  enableLocationSuccess,
  pickUpLocationSuccess,
} from '../../redux/locationSlice';
import useGeolocation from '../hooks/useCurrentLocation';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface locaitonDetails {
  formatted: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
}

export default function Map({navigation}: any) {
  const isDark = useDarkMode();
  const pickUplocation = useSelector(
    (state: RootState) => state.location.currentPickUpLocation,
  );
  const dropLocation = useSelector(
    (state: RootState) => state.location.currentDropOffLocation,
  );
  const {
    currentLongitude,
    currentLatitude,
    locationStatus,
    getOneTimeLocation,
  } = useGeolocation();
  const refreshPage = useSelector((state: RootState) => state.location.refresh);
  const [mapKey, setMapKey] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const GOOGLE_MAPS_APIKEY = 'AIzaSyDiCdvKryVazrxHq2o1EQ66ebViq0pfa6w';
  const GEOAPIFY_API_KEY = '5d559ea3b78942d39c8fbf7428f99628';
  const mapRef = useRef<MapView>(null);
  const dispatch = useDispatch();
  const isSearchingForDriver = useSelector(
    (state: RootState) => state.global.isSearchingForDriver,
  );

  //pick up cords
  const pickUpcords = {
    latitude: pickUplocation?.lat || 27.7172,
    longitude: pickUplocation?.lon || 85.324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // dropoff cords
  const dropOffcords = {
    latitude: dropLocation?.lat || 27.7172,
    longitude: dropLocation?.lon || 85.324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // livecords
  const livecords = {
    latitude: currentLatitude || 27.7172,
    longitude: currentLongitude || 85.324,
    latitudeDelta: 0.0422,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    setMapKey(prevKey => prevKey + 1);
    fetchRoutes();
  }, [dropLocation, pickUplocation, refreshPage]);

  const fetchRoutes = async () => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/routing?waypoints=${pickUplocation?.lat},${pickUplocation?.lon}|${dropLocation?.lat},${dropLocation?.lon}&mode=drive&apiKey=5d559ea3b78942d39c8fbf7428f99628
`,
      );
      // Extract the coordinates from the response
      const extractedCoordinates =
        res.data.features[0]?.geometry?.coordinates[0] || [];

      // Map the coordinates to your desired format
      const formattedCoordinates = extractedCoordinates.map((coord: any) => ({
        latitude: coord[1], // Latitude is the second element in GeoJSON
        longitude: coord[0], // Longitude is the first element in GeoJSON
      }));

      setRouteCoordinates(formattedCoordinates);

      //make the refresh state false
      dispatch(changerefreshstate());
    } catch (error) {
      console.log(error);
    }
  };

  // Fit the map to coordinates
  const fitToCoordinates = () => {
    if (mapRef.current && routeCoordinates.length > 0) {
      mapRef.current.fitToCoordinates(routeCoordinates, {
        edgePadding: {
          top: 90,
          right: 70,
          bottom: 60,
          left: 70,
        },
        animated: true,
      });
    }
  };

  useEffect(() => {
    fitToCoordinates();
  }, [routeCoordinates]);

  //handel pickup drag end
  const handelPickUpDrag = async (e: any) => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_API_KEY}`,
      );

      const locationName =
        res.data.features[0]?.properties?.formatted || 'Unknown Location';
      const locationDetails = {
        formatted: locationName,
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        country: '',
        lat: latitude || 0,
        lon: longitude || 0,
      };
      dispatch(pickUpLocationSuccess(locationDetails));
    } catch (error) {
      console.error(error);
    }
  };

  //handel pickup drag end
  const handelDropDrag = async (e: any) => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_API_KEY}`,
      );

      const locationName =
        res.data.features[0]?.properties?.formatted || 'Unknown Location';
      const locationDetails = {
        formatted: locationName,
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        country: '',
        lat: latitude,
        lon: longitude,
      };
      dispatch(dropOffLocationSuccess(locationDetails));
    } catch (error) {
      console.error(error);
    }
  };

  //find the name of the currentlocaiton using the currentlocaiton latitude and longitude
  const findLocaitonName = async () => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${currentLatitude}&lon=${currentLongitude}&apiKey=${GEOAPIFY_API_KEY}`,
      );

      const locationName =
        res.data.features[0]?.properties?.formatted || 'Unknown Location';
      const locationDetails = {
        formatted: locationName,
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        country: '',
        lat: currentLatitude || 0,
        lon: currentLongitude || 0,
      };
      if (locationDetails) {
        dispatch(pickUpLocationSuccess(locationDetails));
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <View
      style={[tw`w-full relative  overflow-hidden`, {aspectRatio: 2 / 2.5}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <MapView
        key={mapKey} // Use state key
        style={{flex: 1}}
        initialRegion={livecords}
        showsUserLocation={true}
        followsUserLocation={true}
        loadingEnabled={true}
        loadingIndicatorColor="black"
        ref={mapRef} // Add ref to MapView
      >
        {pickUplocation && (
          <Marker
            draggable
            onDragEnd={e => {
              handelPickUpDrag(e);
            }}
            coordinate={pickUpcords}
            title={pickUplocation?.formatted || 'Your location'}
            description="Your pickup Location"
            pinColor="green"
          />
        )}
        {dropLocation && (
          <>
            <Marker
              draggable
              onDragEnd={e => {
                handelDropDrag(e);
              }}
              coordinate={dropOffcords}
              title={dropLocation?.formatted || 'Your location'}
              description="your drop Location"
            />
          </>
        )}

        {/* Show the directions */}
        {pickUplocation && dropLocation && (
          <Polyline
            coordinates={routeCoordinates} // Use fetched route coordinates
            strokeColor="#007AFF" // Route color
            strokeWidth={5} // Route width
          />
        )}
      </MapView>

      {/* //icon to tirgger the drawer */}
      <Pressable
        onPress={() => navigation.openDrawer()}
        style={[
          tw` absolute top-10 left-5 z-30 bg-white rounded-full p-1 aspect-square`,
        ]}>
        <Icon style={[tw` z-50`]} name="menu" size={30} color={'black'} />
      </Pressable>

      {/* //add current locaiton as pickup locaiton */}
      <Pressable
        onPress={findLocaitonName}
        style={[
          tw` flex absolute bottom-5 right-5  bg-white rounded-full p-1 aspect-square overflow-hidden items-center justify-center`,
        ]}>
        <Icon style={[tw` z-50`]} name="near-me" size={30} color={'black'} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({});
