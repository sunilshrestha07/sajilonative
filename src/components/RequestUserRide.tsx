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
import UserRideConfirmed from './UserRideConfirmed';
import {setSocket} from '../../redux/socketSlice';

export default function RequestUserRide() {
  const socketRef = useRef<Socket | null>(null);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const driverId = currentUser?._id;
  const [userRideData, setUserRideData] = useState<DataSendByUserInterface[]>(
    [],
  );
  const isRideBooked = useSelector(
    (state: RootState) => state.global.isRideBooked,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!driverId) return;
    const socket = io(
      'https://socketiobackendtest-production.up.railway.app/',
      {
        auth: {
          drivertoken: driverId,
        },
      },
    );
    dispatch(setSocket(socket));
    socketRef.current = socket;

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
    });

    socket.on('terminateFindDriverRequest', ({formdata}) => {
      setUserRideData(filtered =>
        filtered.filter(data => data.id !== formdata.id),
      );
    });

    socket.on('requestRideToUser', () => {
      console.log('driver made request to the user');
    });

    socket.on('rideHasBeenCancled', ({formdata}) => {
      console.log('ride has been calcled by user');
      dispatch(rideBookedUserEmpty());
      dispatch(setIsRideBooked());
      Alert.alert(`ride has been calcled by user ${formdata.name}`);
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
        latitude: 0,
        longitude: 0,
      },
      vechicel: {
        color: currentUser?.vehicle.color,
        plate: currentUser?.vehicle.plate,
        vehicleType: currentUser?.vehicle.vehicleType,
      },
      price: data.price,
      distance: data.distance,
    };
    socketRef.current.emit('requestRideToUser', {driverData, userId});
  };

  return (
    <>
      <View>
        {isRideBooked ? (
          <View>
            <UserRideConfirmed />
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
                        style={[tw`w-100% py-1 rounded-md bg-gray-400 my-2`]}>
                        <View
                          style={[
                            tw` flex flex-row  items-center justify-around `,
                          ]}>
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
                            <Text style={[tw` text-sm opacity-90  `]}>
                              {item.pickuplocation.name}
                            </Text>
                            <Text style={[tw` text-sm opacity-90  `]}>
                              {item.droplocation.name}
                            </Text>
                            <Text>Rs:100</Text>
                          </View>
                          <TouchableOpacity
                            style={[tw`  justify-center`]}
                            onPress={() => requestUser(item)}>
                            <Text
                              style={[
                                tw` bg-white px-10 py-4 rounded-lg text-center`,
                              ]}>
                              Request
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
