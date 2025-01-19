import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {Image} from 'moti';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {setIsCancelRideTrue, setIsRideBooked} from '../../redux/globalSlice';
import {useResetReduxState} from '../hooks/resetRudux';

export default function UserRideConfirmed() {
  const rideConfirmedUser = useSelector(
    (state: RootState) => state.ride.rideConfirmedUser,
  );
  const dispatch = useDispatch();
  const socket = useSelector((state: RootState) => state.socket.socket);
  const resetReduxState = useResetReduxState();

  //useeffecf for socket
  useEffect(() => {
    if (!socket) return;

    //cancle ride


    return () => {
      socket.off('rideHasBeenCancled');
    };
  }, []);

  //conformation for cancelling the ride
  const showConfirmationPopup = () => {
    Alert.alert(
      'Confirm End Ride',
      'Are you sure you want to end the ride?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            handleLogout();
          },
        },
      ],
      {cancelable: false},
    );
  };

  //handel logout
  const handleLogout = async () => {
    await resetReduxState();
    dispatch(setIsRideBooked());

    // Optionally navigate to a login screen
  };

  //handel canle ride click event
  const handelCancelRide = () => {
    // socket?.emit('CancelRide', {driverId:rideConfirmedUser?.id,formdata});
    console.log(' ride cancle');
    dispatch(setIsRideBooked());
  };

  return (
    <View style={[tw` w-full h-full rounded-lg overflow-hidden  `]}>
      <View>
        {/* //this the profile and message and call bar */}
        <View>
          <View
            style={[
              tw` w-full  flex-row items-center justify-between px-5 py-2 bg-gray-200 `,
            ]}>
            <View style={[tw`w-8/12 flex-row gap-4 items-center `]}>
              <Image
                source={{uri: rideConfirmedUser?.avatar}}
                style={tw`w-13 aspect-square rounded-full`}
              />
              <View style={[tw` justify-center items-center `]}>
                <Text
                  style={[
                    tw` text-lg font-medium`,
                    {fontFamily: 'Quicksand-Bold'},
                  ]}>
                  {rideConfirmedUser?.name}
                </Text>
                <View style={[tw`flex-row items-center gap-2`]}>
                  <Icon
                    style={[tw` z-50`]}
                    name="star"
                    size={23}
                    color={'orange'}
                  />
                  <Text style={[tw` opacity-50`]}>4.5</Text>
                </View>
              </View>
            </View>
            <View>
              <View style={[tw`flex-row gap-5 items-center `]}>
                <TouchableHighlight>
                  <View style={[tw`bg-blue-400 p-2 rounded-full items-center`]}>
                    <Icon
                      style={[tw` z-50`]}
                      name="message"
                      size={25}
                      color={'black'}
                    />
                  </View>
                </TouchableHighlight>
                <TouchableHighlight>
                  <View style={[tw`bg-blue-400 p-2 rounded-full items-center`]}>
                    <Icon
                      style={[tw` z-50`]}
                      name="phone"
                      size={25}
                      color={'black'}
                    />
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>

        {/* //this the location info section */}
        <View>
          <View
            style={[
              tw`flex-col px-2  items-end  py-3 relative border-b-[1px] border-gray-300  `,
            ]}>
            <View style={[tw` flex flex-row gap-6  items-center`]}>
              <MaterialIcons name="my-location" size={25} color="orange" />;
              <Text
                style={[
                  tw`font-medium w-10/12 border-b-[1px] border-gray-300 py-3 pb-4  `,
                ]}>
                {rideConfirmedUser?.pickuplocation.name}
              </Text>
            </View>
            <View style={[tw` flex flex-row gap-6  items-center`]}>
              <MaterialIcons name="pin-drop" size={25} color="black" />
              <Text style={[tw`font-medium w-10/12  py-3  `]}>
                {rideConfirmedUser?.droplocation.name}
              </Text>
            </View>

            {/* absolute line */}
            <View
              style={[
                tw`absolute top-12 left-[9.5%] bg-black h-[25%] w-[1px]`,
              ]}></View>
          </View>
        </View>

        {/* //this the the distance price and vehicle type */}
        <View>
          <View style={[tw` flex-row items-center justify-between px-5 py-2`]}>
            <View style={[tw` w-2/12 `]}>
              {rideConfirmedUser &&
                (rideConfirmedUser.vechicelType === 'Car' ||
                rideConfirmedUser.vechicelType === 'Comfort' ? (
                  <MaterialIcons
                    name="directions-car"
                    size={40}
                    color="black"
                  />
                ) : (
                  <MaterialIcons
                    name="directions-bike"
                    size={40}
                    color="black"
                  />
                ))}
            </View>
            <View
              style={[tw`flex-row items-center justify-around gap-5  w-10/12`]}>
              <View style={[tw`flex-col gap-1`]}>
                <Text style={[tw` opacity-60`]}>Distance</Text>
                <Text>{rideConfirmedUser?.distance} km</Text>
              </View>
              <View style={[tw`flex-col gap-1`]}>
                <Text style={[tw` opacity-60`]}>Time</Text>
                <Text>
                  {parseFloat(
                    (((rideConfirmedUser?.distance ?? 0) / 30) * 60).toFixed(1),
                  )}{' '}
                  min
                </Text>
              </View>
              <View style={[tw`flex-col gap-1`]}>
                <Text style={[tw` opacity-60`]}>Price</Text>
                <Text>Rs: {rideConfirmedUser?.price}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* //cancel button */}
        <View style={[tw`w-100% px-5 mt-3 `]}>
          <TouchableHighlight
            onPress={showConfirmationPopup}
            style={[tw`w-100% rounded-lg bg-black overflow-hidden`]}>
            <Text
              style={[
                tw`text-lg  font-semibold  text-white py-3 text-center `,
              ]}>
              Completed
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
