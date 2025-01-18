import {
  Alert,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Map from '../components/Map';
import useDarkMode from '../hooks/useDarkMode';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../assets/colors';
import axios from 'axios';
import {TouchableNativeFeedback} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  dropOffLocationSuccess,
  pickUpLocationSuccess,
  changerefreshstate,
  emptyPickUpLocation,
} from '../../redux/locationSlice';
import {RootState} from '../../redux/store';
import {getDistance} from 'geolib';
import {io, Socket} from 'socket.io-client';
import FindDriver from '../components/FindDriver';
import Motiview, {MotiView} from 'moti';
import {setIsSearchingForDriver} from '../../redux/globalSlice';
import RequestUserRide from '../components/RequestUserRide';
import RideComfirmed from '../components/RideComfirmed';

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

interface vechicelInterface {
  name: string;
  price: number;
}

interface findDriverInterface {
  pickUpLocation: string;
  dropOffLocation: string;
  vechicelType: string;
  price: number;
  distance: number;
  user: {
    name: string;
    _id: string;
    email: string;
  };
}

export default function Home({navigation}: any) {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const pickUplocationstate = useSelector(
    (state: RootState) => state.location.currentPickUpLocation,
  );
  const dropLocationstate = useSelector(
    (state: RootState) => state.location.currentDropOffLocation,
  );
  const [locationInputIsActive, setLocationInputIsActive] =
    useState<Boolean>(false);
  const isDark = useDarkMode();
  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [dropLocation, setDropLocation] = useState<string>('');
  const [vechicelType, setVechicelType] = useState<vechicelInterface>({
    name: 'Bike',
    price: 30,
  });
  const [locationRecommendaion, setLocationRecommendaion] = useState<
    locaitonDetails[]
  >([]);
  const [activeInput, setActiveInput] = useState<'pickup' | 'drop' | null>(
    null,
  );
  const [dropLocationAllInfo, setDropLocationAllInfo] =
    useState<locaitonDetails | null>(null);
  const [pickupLocationAllInfo, setPickupLocationAllInfo] =
    useState<locaitonDetails | null>(null);
  const dispatch = useDispatch();
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [formData, setFormData] = useState<findDriverInterface>();
  const isSearchingForDriver = useSelector(
    (state: RootState) => state.global.isSearchingForDriver,
  );
  const [userRole, setUserRole] = useState<string>('user');
  const isRideBooked = useSelector(
    (state: RootState) => state.global.isRideBooked,
  );

  //options for the ride
  const options = [
    {name: 'Bike', image: require('../../assets/images/bike.png'), price: 30},
    {name: 'Car', image: require('../../assets/images/car.png'), price: 40},
    {
      name: 'Comfort',
      image: require('../../assets/images/comfort.png'),
      price: 50,
    },
    {
      name: 'Delivery',
      image: require('../../assets/images/ship.png'),
      price: 25,
    },
  ];

  //fetch pickup location
  const fetchPickupLocation = async (text: string) => {
    setPickupLocation(text);
    setActiveInput('pickup');

    try {
      if (pickupLocation.length > 3) {
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/autocomplete`,
          {
            params: {
              text: text, // The query text
              apiKey: '5d559ea3b78942d39c8fbf7428f99628',
              limit: 5,
            },
          },
        );
        const features = response.data.features;
        const locations: locaitonDetails[] = features.map((feature: any) => ({
          formatted: feature.properties.formatted,
          address_line1: feature.properties.address_line1,
          address_line2: feature.properties.address_line2,
          city: feature.properties.city,
          country: feature.properties.country,
          lat: feature.properties.lat,
          lon: feature.properties.lon,
        }));

        setLocationRecommendaion(locations);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //fetch drop location
  const fetchDropLocation = async (text: string) => {
    setDropLocation(text);
    setActiveInput('drop');
    try {
      if (dropLocation.length > 3) {
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/autocomplete`,
          {
            params: {
              text: text, // The query text
              apiKey: '5d559ea3b78942d39c8fbf7428f99628',
              limit: 5,
            },
          },
        );
        const features = response.data.features;
        const locations: locaitonDetails[] = features.map((feature: any) => ({
          formatted: feature.properties.formatted,
          address_line1: feature.properties.address_line1,
          address_line2: feature.properties.address_line2,
          city: feature.properties.city,
          country: feature.properties.country,
          lat: feature.properties.lat,
          lon: feature.properties.lon,
        }));
        setLocationRecommendaion(locations);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //clear pickup location
  const clearPickupLocation = () => {
    setPickupLocation('');
    setLocationRecommendaion([]);
    setPickupLocationAllInfo(null);
    dispatch(emptyPickUpLocation());
  };

  //clear drop location
  const clearDropLocation = () => {
    setDropLocation('');
    setLocationRecommendaion([]);
    setDropLocationAllInfo(null);
  };

  //handel selected specific location and store in redux
  const handelSetLocationInfo = (location: locaitonDetails) => {
    if (activeInput === 'pickup') {
      dispatch(pickUpLocationSuccess(location));
      setPickupLocationAllInfo(location);
      setPickupLocation(location.formatted);
    } else if (activeInput === 'drop') {
      dispatch(dropOffLocationSuccess(location));
      setDropLocationAllInfo(location);
      setDropLocation(location.formatted);
    }
  };

  //refresh the page if the bothe pickup and drop location is selected
  const refreshPage = () => {
    if (
      (pickUplocationstate && dropLocation) ||
      (pickupLocation && dropLocationstate)
    ) {
      setLocationInputIsActive(false);
      dispatch(changerefreshstate());
    }
  };

  //set vechicle and clculate the price
  const selectVehicleType = (option: vechicelInterface) => {
    setVechicelType(option);
    calculatePrice(option);
  };

  //calculate the distance between the pickup and drop location
  const calculateDistance = () => {
    if (pickUplocationstate?.lat && dropLocationstate?.lat) {
      const distance = getDistance(
        {
          latitude: pickUplocationstate.lat,
          longitude: pickUplocationstate.lon,
        },
        {latitude: dropLocationstate.lat, longitude: dropLocationstate.lon},
      );
      const distanceinKm = distance / 1000;
      setTotalDistance(distanceinKm);
      const totalprice = Math.floor(distanceinKm * vechicelType.price);
      setPrice(totalprice);
    }
    return 0;
  };

  //calculate price
  const calculatePrice = (vehicleOption?: vechicelInterface) => {
    const vehicle = vehicleOption || vechicelType;
    const totalprice = totalDistance * vehicle.price;
    setPrice(Math.floor(totalprice));
  };

  useEffect(() => {
    refreshPage();
    calculateDistance();
  }, [pickupLocationAllInfo, dropLocationAllInfo]);

  useEffect(() => {
    calculatePrice();
  }, [totalDistance]);

  //handel find driver click event
  const handelFindDriver = () => {
    dispatch(setIsSearchingForDriver());
  };

  return (
    <View style={[tw` h-100%  w-full relative`]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.backgroundColorNormal}
      />
      <View style={[tw` h-full`]}>
        <View style={[tw` z-0`]}>
          <Map navigation={navigation} />
        </View>

        {/* //if the ride has been confirmed then dont show the location input and driver options */}
        {isRideBooked ? (
          <View >
            <RideComfirmed />
          </View>
        ) : (
          // if the ride has been confirmed then dont show the location input and driver options
          <View
            style={[
              tw`w-100% h-100% pt-4 rounded-t-3xl px-2 border-[1px] border-black`,
            ]}>
            <View>
              <View style={[tw`h-28 w-100% flex flex-row gap-1`]}>
                {options.map((option, index) => (
                  <View
                    style={[
                      tw`w-24.5% aspect-video border-[1px] border-black rounded-2xl ${
                        vechicelType?.name === option.name ? 'bg-gray-500' : ''
                      } `,
                    ]}
                    key={index}>
                    <View style={tw`w-full h-full items-center justify-center`}>
                      <TouchableNativeFeedback
                        onPress={() => selectVehicleType(option)}>
                        <Image
                          style={[
                            tw`py-2 ${
                              option.name === 'Delivery' ||
                              option.name === 'Bike'
                                ? 'h-16 w-16'
                                : 'h-20 w-20'
                            } `,
                          ]}
                          source={option.image}
                        />
                      </TouchableNativeFeedback>
                    </View>
                    <Text style={[tw`text-center`]}>{option.name}</Text>
                  </View>
                ))}
              </View>

              {/* //location input */}
              <View
                style={[
                  tw`flex flex-col gap-3 -mt-4 ${
                    locationInputIsActive ? ' hidden' : ''
                  }`,
                ]}>
                <View>
                  <TextInput
                    // maxLength={55}
                    selection={{start: 0, end: 0}}
                    onFocus={() => setLocationInputIsActive(true)}
                    value={pickUplocationstate?.formatted}
                    placeholder="Pickup Location"
                    style={[
                      tw`bg-white w-full h-12 rounded-2xl px-4 border border-black `,
                      {textAlign: 'left', textAlignVertical: 'center'},
                    ]}
                  />
                </View>
                <View>
                  <TextInput
                    selection={{start: 0, end: 0}}
                    textAlign="left"
                    onFocus={() => setLocationInputIsActive(true)}
                    value={dropLocationstate?.formatted}
                    placeholder="Drop Location"
                    style={[
                      tw`bg-white w-100% h-12 rounded-2xl px-4  border-[1px] border-black`,
                    ]}
                  />
                </View>
              </View>

              {/* //show the price of the drive */}
              <View>
                {pickUplocationstate?.formatted &&
                  dropLocationstate?.formatted &&
                  price > 0 && (
                    <Text style={tw`text-center font-medium text-base mt-2`}>
                      Rs: {price}
                    </Text>
                  )}
              </View>

              {/* //find driver button */}
              <View style={[tw` w-full h-12 items-center justify-center mt-3`]}>
                <TouchableOpacity
                  onPress={handelFindDriver}
                  style={[
                    tw` bg-black h-12 px-8 items-center justify-center rounded-2xl text-center`,
                  ]}>
                  <Text
                    style={[
                      tw` text-lg text-white`,
                      {fontFamily: 'Quicksand-Bold'},
                    ]}>
                    Find Driver
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* //if the setlocaitn is actinve show the location input */}
      <MotiView
        from={{
          translateY: 800,
        }}
        animate={{
          translateY: locationInputIsActive ? 0 : 900,
        }}
        transition={{
          type: 'timing', // Smooth animation
          duration: 400, // Same duration for consistency
        }}
        style={[
          tw`w-100% h-100% pt-4 px-2 border-[1px] border-black bg-white absolute z-50 top-0 flex flex-col gap-4`,
        ]}>
        <View
          style={[tw`flex flex-row h-10 justify-center items-center w-100% `]}>
          <Text style={[tw`text-center  text-black text-xl font-semibold`]}>
            Enter your route
          </Text>

          <View
            style={[tw`absolute right-0 px-2  items-center justify-center`]}>
            <TouchableOpacity onPress={() => setLocationInputIsActive(false)}>
              <Icon name="close" size={35} color={'black'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[tw`w-100%  relative items-center`]}>
          <TextInput
            maxLength={53}
            onChangeText={text => fetchPickupLocation(text)}
            value={
              pickUplocationstate
                ? pickUplocationstate.formatted
                : pickupLocation
            }
            placeholder="Pickup Location"
            style={[
              tw`bg-white w-100% h-14 rounded-2xl px-4 pr-10 border-[1px] border-black`,
              {textAlign: 'left'},
            ]}
          />
          <View
            style={[
              tw`absolute right-0 p-2   h-full   items-center justify-center`,
            ]}>
            <TouchableOpacity onPress={() => clearPickupLocation()}>
              {(pickupLocation.length > 5 ||
                (pickUplocationstate?.formatted &&
                  pickUplocationstate.formatted.length > 5)) && (
                <Icon name="close" size={20} color={'gray'} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={[tw`w-100%  relative items-center`]}>
          <TextInput
            maxLength={53}
            onChangeText={text => fetchDropLocation(text)}
            value={dropLocation}
            placeholder="Drop Location"
            style={[
              tw`bg-white w-100% h-14 rounded-2xl px-4 pr-10 border-[1px] border-black`,
              {textAlign: 'left'},
            ]}
          />
          <View
            style={[
              tw`absolute right-0 p-2  h-full  items-center justify-center`,
            ]}>
            <TouchableOpacity onPress={() => clearDropLocation()}>
              {dropLocation.length > 5 && (
                <Icon name="close" size={20} color={'gray'} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <FlatList
            data={locationRecommendaion}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  if (activeInput === 'pickup') {
                    setPickupLocation(item.formatted);
                    handelSetLocationInfo(item);
                  } else {
                    setDropLocation(item.formatted);
                    handelSetLocationInfo(item);
                  }
                  setLocationRecommendaion([]);
                }}>
                <View style={[tw`w-100% py-1`]}>
                  <Text style={[tw` text-base bg-gray-200 p-2 rounded-lg`]}>
                    {item.formatted}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </MotiView>

      {/* //find the driver component popup */}
      <MotiView
        from={{
          translateY: 500,
        }}
        animate={{
          translateY: isSearchingForDriver ? 0 : 500,
        }}
        transition={{
          type: 'timing', // Smooth animation
          duration: 300, // Same duration for consistency
        }}
        style={[
          tw` absolute bottom-0 left-0  h-50% w-100% rounded-3xl  overflow-hidden  `,
        ]}>
        {userRole === 'captain' ? (
          <RequestUserRide />
        ) : (
          <FindDriver vechicelName={vechicelType.name} price={price} />
        )}
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({});
