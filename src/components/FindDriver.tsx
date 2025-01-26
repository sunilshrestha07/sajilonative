import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import tw from 'twrnc';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {
  resetIsCancelRideTrue,
  setIsCancelRideTrue,
  setIsRideBooked,
  setIsRideStartedFalse,
  setIsSearchingForDriver,
  setTotalPrice,
} from '../../redux/globalSlice';
import {RootState} from '../../redux/store';
import {io, Socket} from 'socket.io-client';
import {DataSendByDriverInterface} from '../../declareInterface';
import {getDistance} from 'geolib';
import {rideBookedDriverSuccess} from '../../redux/rideSlice';
import {setSocket} from '../../redux/socketSlice';

export default function FindDriver({
  vechicelName,
  price,
  distance,
}: {
  vechicelName: string;
  price: number;
  distance: number;
}) {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const userId = currentUser?._id;
  const socketRef = useRef<Socket | null>(null);
  const pickUplocationstate = useSelector(
    (state: RootState) => state.location.currentPickUpLocation,
  );
  const dropLocationstate = useSelector(
    (state: RootState) => state.location.currentDropOffLocation,
  );
  const driverRequest = [
    {
      name: 'john one',
      phone: '123456789',
      avatar: require('../../assets/images/sajilo.png'),
      distance: 15,
      rating: 2.5,
    },
    {
      name: 'john one',
      phone: '123456789',
      avatar: require('../../assets/images/sajilo.png'),
      distance: 15,
      rating: 2.5,
    },
    {
      name: 'john one',
      phone: '123456789',
      avatar: require('../../assets/images/sajilo.png'),
      distance: 15,
      rating: 2.5,
    },
    {
      name: 'john one',
      phone: '123456789',
      avatar: require('../../assets/images/sajilo.png'),
      distance: 15,
      rating: 2.5,
    },
    {
      name: 'john one',
      phone: '123456789',
      avatar: require('../../assets/images/sajilo.png'),
      distance: 15,
      rating: 2.5,
    },
    {
      name: 'john one',
      phone: '123456789',
      avatar: require('../../assets/images/sajilo.png'),
      distance: 15,
      rating: 2.5,
    },
    {
      name: 'john one',
      phone: '123456789',
      avatar: require('../../assets/images/sajilo.png'),
      distance: 15,
      rating: 2.5,
    },
  ];
  const dispatch = useDispatch();
  const isSearchingForDriver = useSelector(
    (state: RootState) => state.global.isSearchingForDriver,
  );
  const [driverRequestData, setDriverRequestData] = useState<
    DataSendByDriverInterface[]
  >([]);
  const isRideBooked = useSelector(
    (state: RootState) => state.global.isRideBooked,
  );
  const isCancelRideTrue = useSelector(
    (state: RootState) => state.global.isCancelRideTrue,
  );

  //formdata of the user to send to the Driver
  const formdata = {
    name: currentUser?.name,
    id: currentUser?._id,
    email: currentUser?.email,
    phone: '9808048030',
    avatar: currentUser?.avatar,
    pickuplocation: {
      latitude: pickUplocationstate?.lat,
      longitude: pickUplocationstate?.lon,
      name: pickUplocationstate?.formatted,
    },
    droplocation: {
      latitude: dropLocationstate?.lat,
      longitude: dropLocationstate?.lon,
      name: dropLocationstate?.formatted,
    },
    price: price,
    vechicelType: vechicelName,
    distance: distance,
  };

  //useeffect for socket
  useEffect(() => {
    if (!userId) return;
    const socket = io(
      'https://socketiobackendtest-production.up.railway.app/',
      {
        auth: {
          token: userId,
        },
        transports: ['websocket'],
        autoConnect: true,
        reconnectionDelay: 1000,
      },
    );
    socketRef.current = socket;
    dispatch(setSocket(socket));

    //when the user request driver
    socketRef.current.on('findDriver', () => {
      console.log('user is searching for driver');
    });

    //when the driver request the ride service
    socket.on('driverResponse', ({driverData}) => {
      setDriverRequestData(prev =>
        prev.find(item => item.id === driverData.id)
          ? [...prev]
          : [...prev, driverData],
      );
    });

    //accept the rider request
    socket.on('AcceptRequest', () => {
      console.log('user accepted the request of the driver');
    });

    socket.on('cancelRide', () => {
      console.log('cancled the ride by the user');
    });

    return () => {
      socket.off('findDriver');
      socket.off('driverResponse');
      socket.off('AcceptRequest');
      socket.off('cancelRide');
    };
  }, []);

  //handel find driver requested
  const findDriver = () => {
    dispatch(resetIsCancelRideTrue());
    if (pickUplocationstate && dropLocationstate) {
      try {
        //data to send when the user clicks find driver
        socketRef.current?.emit('findDriver', {formdata});
        dispatch(setTotalPrice(price));
        dispatch(setIsRideStartedFalse())
      } catch (error) {
        console.log('Error finding driver', error);
      }
    } else {
      Alert.alert('Please select pickup and drop location');
    }
  };

  //useeffect for finding driver only if searching for driver
  useEffect(() => {
    if (isSearchingForDriver) {
      findDriver();
    }
  }, [isSearchingForDriver]);

  //handel driverfetching popup
  const handelDriverSearching = () => {
    dispatch(setIsSearchingForDriver());
    setDriverRequestData([]);
  };

  //calcualte the distance between the user and the driver and show them
  const calculateDistance = ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    if (pickUplocationstate) {
      const distance = getDistance(
        {
          latitude: latitude,
          longitude: longitude,
        },
        {latitude: pickUplocationstate.lat, longitude: pickUplocationstate.lon},
      );
      return (distance / 1000).toFixed(1); // return distance in km
    } else {
      console.log('Pick up location is not set');
      return null;
    }
  };

  //handel rider request
  const acceptRideRequest = (driverData: DataSendByDriverInterface) => {
    setDriverRequestData([]);
    const driverId = driverData.id;
    if (!socketRef.current) return;
    socketRef.current.emit('AcceptRequest', {formdata, driverId});
    dispatch(rideBookedDriverSuccess(driverData));
    dispatch(setIsSearchingForDriver());
    dispatch(setIsRideBooked());
    dispatch(setIsCancelRideTrue());
  };

  return (
    <>
      <View style={[tw`w-100% h-100% bg-white relative rounded-3xl `]}>
        <View style={[tw`w-full items-center`]}>
          <View style={[tw`w-10 `]}>
            <TouchableOpacity onPress={handelDriverSearching}>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={40}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={[
            tw` text-2xl font-semibold text-center pb-2 `,
            {fontFamily: 'Quicksand-Bold'},
          ]}>
          Searching for Drivers
        </Text>
        <View style={[tw` px-4  h-9/12 `]}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={driverRequestData}
            renderItem={({item}) => (
              <View style={[tw`w-100% py-2 rounded-md bg-gray-400 my-2`]}>
                <View style={[tw` flex flex-row  justify-around `]}>
                  <View
                    style={[
                      tw` w-15 aspect-square rounded-full overflow-hidden `,
                    ]}>
                    <Image
                      style={[tw` w-full h-full`]}
                      source={{uri: item.avatar}}
                    />
                  </View>
                  <View style={[tw` justify-center`]}>
                    <Text style={[tw` text-xl font-semibold `]}>
                      {item.name}
                    </Text>
                    <Text style={[tw` text-sm opacity-65  `]}>
                      {calculateDistance(item.location)} km away
                    </Text>
                    <Text style={[tw` text-sm opacity-65  `]}></Text>
                  </View>
                  <TouchableOpacity
                    style={[tw`  justify-center`]}
                    onPress={() => acceptRideRequest(item)}>
                    <Text
                      style={[tw` bg-white px-15 py-4 rounded-lg text-center`]}>
                      Accept
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
