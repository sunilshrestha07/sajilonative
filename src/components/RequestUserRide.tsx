import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import tw from 'twrnc';
import io, {Socket} from 'socket.io-client';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {DataSendByUserInterface} from '../../declareInterface';
import {
  rideBookedUserEmpty,
  rideBookedUserSuccess,
} from '../../redux/rideSlice';
import {setIsRideBooked} from '../../redux/globalSlice';
import {setdriversocket} from '../../redux/socketSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StartRide from './StartRide';

export default function RequestUserRide() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [userRideData, setUserRideData] = useState<DataSendByUserInterface[]>(
    [],
  );
  const isRideBooked = useSelector(
    (state: RootState) => state.global.isRideBooked,
  );
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);
  const driverlocation = useSelector(
    (state: RootState) => state.location.driverlocation,
  );

  useEffect(() => {
    const socket = io(
      'https://socketiobackendtest-production.up.railway.app/',
      {
        transports: ['websocket'], // Ensures WebSocket is used
        autoConnect: true,
        reconnectionDelay: 1000,
        auth: {
          drivertoken: currentUser?._id,
        },
      },
    );
    socketRef.current = socket;
    dispatch(setdriversocket(socket));

    socket.on('broadCastDrives', ({formdata}) => {
      const data = formdata.formdata;
      setUserRideData(prev =>
        prev.find(item => item.id === data.id) ? prev : [...prev, data],
      );
    });

    //when the ride has been accepted
    socket.on('rideAccepted', ({formdata}) => {
      dispatch(rideBookedUserSuccess(formdata));
      dispatch(setIsRideBooked());
      setUserRideData(filtered =>
        filtered.filter(data => data.id !== formdata.id),
      );
      console.log('ride has been accepted');
    });

    socket.on('terminateFindDriverRequest', ({formdata}) => {
      setUserRideData(filtered =>
        filtered.filter(data => data.id !== formdata.id),
      );
    });

    socket.on('requestRideToUser', () => {
      console.log('driver made request to the user');
    });

    return () => {
      socket.off('broadCastDrives');
      socket.off('requestRideToUser');
      socket.off('rideAccepted');
      socket.off('terminateFindDriverRequest');
      socket.off('rideHasBeenCancled');
    };
  }, []);

  const requestUser = (data: DataSendByUserInterface) => {
    if (!socketRef.current) return;
    //data to send to the user
    const userId = data.id;
    const driverData = {
      name: currentUser?.name,
      id: currentUser?._id,
      email: currentUser?.email,
      phone: currentUser?.phone,
      avatar: currentUser?.avatar,
      location: {
        latitude: driverlocation?.lat || data.pickuplocation.latitude - 0.0015,
        longitude: driverlocation?.lon || data.pickuplocation.longitude - 0.00099,
      },
      vechicel: {
        color: currentUser?.vehicle.color,
        plate: currentUser?.vehicle.plate,
        vehicleType: currentUser?.vehicle.vehicleType,
      },
      price: data.price,
      distance: data.distance,
    };
    if (driverData.location.latitude && driverData.location.longitude) {
      socketRef.current.emit('requestRideToUser', {driverData, userId});
    } else {
      Alert.alert('You are have to set to active status');
    }
  };
  const handelReject = (formdata: DataSendByUserInterface) => {
    setUserRideData(filtered =>
      filtered.filter(data => data.id !== formdata.id),
    );
  };

  return (
    <>
      <View>
        {isRideBooked ? (
          <View>
            <StartRide />
          </View>
        ) : (
          <View
            style={[
              tw`w-100% items-center h-full  rounded-lg overflow-hidden`,
            ]}>
            <View style={[tw`w-100% px-5 `]}>
              <View>
                <Text style={[tw`text-center text-2xl font-medium mt-3`]}>
                  Availabel rides
                </Text>
              </View>
              <View>
                <View style={[tw` w-full h-8.4/12  `]}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={userRideData}
                    renderItem={({item}) => (
                      <View
                        style={[
                          tw`w-100% py-2 rounded-md bg-gray-300 my-2 flex-col gap-2 px-2 `,
                        ]}>
                        <View
                          style={[
                            tw` flex flex-row items-center  gap-4 px-4  py-2 `,
                          ]}>
                          <View
                            style={[
                              tw` w-15 aspect-square rounded-full overflow-hidden bg-white `,
                            ]}>
                            <Image
                              style={[tw` w-full h-full`]}
                              source={{uri: item.avatar}}
                            />
                          </View>
                          <View>
                            <View>
                              <Text style={[tw` font-medium text-2xl`]}>
                                {item.name}
                              </Text>
                            </View>
                            <View style={[tw` flex flex-row gap-2 opacity-85`]}>
                              <View>
                                <Text>Price :Rs {item.price} ||</Text>
                              </View>
                              <View>
                                <Text> Distance :{item.distance} km</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <View style={[tw` flex flex-col `]}>
                          <View
                            style={[tw` flex flex-col gap-2 px-4 opacity-85`]}>
                            <View
                              style={[
                                tw`flex flex-row gap-1 items-center text-center`,
                              ]}>
                              <Image
                                source={require('../../assets/images/pin.png')}
                                style={[tw`w-6 h-6`]}
                              />
                              <Text>{item.pickuplocation.name}</Text>
                            </View>
                            <View
                              style={[
                                tw`flex flex-row gap-1 items-center text-center`,
                              ]}>
                              <Icon name="flag" size={23} color="red" />
                              <Text> {item.droplocation.name}</Text>
                            </View>
                          </View>
                        </View>
                        <View
                          style={[
                            tw` flex flex-row justify-evenly w-full py-2 `,
                          ]}>
                          <TouchableOpacity
                            style={[tw`  w-2/5 justify-center`]}
                            onPress={() => requestUser(item)}>
                            <Text
                              style={[
                                tw` bg-green-600 text-white  py-3 rounded-lg text-center`,
                              ]}>
                              Request
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[tw` w-2/5  justify-center`]}
                            onPress={() => handelReject(item)}>
                            <Text
                              style={[
                                tw` bg-red-500 text-white  py-3 rounded-lg text-center`,
                              ]}>
                              Reject
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
