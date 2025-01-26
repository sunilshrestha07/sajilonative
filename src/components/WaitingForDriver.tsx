import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {Image} from 'moti';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {getDistance} from 'geolib';
import {
  setIsCancelRideTrue,
  setIsRideBooked,
  setIsRideStarted,
} from '../../redux/globalSlice';

export default function WaitingForDriver() {
  const rideConfirmedDriver = useSelector(
    (state: RootState) => state.ride.rideConfirmedDriver,
  );
  const pickUplocationstate = useSelector(
    (state: RootState) => state.location.currentPickUpLocation,
  );
  const dropLocationstate = useSelector(
    (state: RootState) => state.location.currentDropOffLocation,
  );
  const [distance, setDistance] = useState<number>(0);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const socket = useSelector((state: RootState) => state.socket.socket);
  const isRideStated = useSelector(
    (state: RootState) => state.global.isRideStarted,
  );

  //get the distance of the two poinsts
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
      setDistance(parseFloat(distanceinKm.toFixed(1)));
    }
    return 0;
  };

  useEffect(() => {
    calculateDistance();
  }, [rideConfirmedDriver]);

  //formdata to send to the driver
  const formdata = {
    name: currentUser?.name,
    email: currentUser?.email,
    phone: currentUser?.phone,
    id: currentUser?._id,
  };

  //conformation for cancelling the ride
  const showConfirmationPopup = () => {
    Alert.alert(
      'Confirm Cancellation',
      'Are you sure you want to cancel the ride?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            handelCancelRide();
          },
        },
      ],
      {cancelable: false},
    );
  };

  //handel canle ride click event
  const handelCancelRide = () => {
    socket?.emit('CancelRide', {driverId: rideConfirmedDriver?.id, formdata});
    console.log(' ride cancle');
    dispatch(setIsRideBooked());
  };

  return (
    <View>
      <View style={[tw` w-full h-full rounded-lg overflow-hidden  `]}>
        <View>
          {/* //this the profile and message and call bar */}
          <View>
            <View
              style={[
                tw` w-full  flex-row items-center justify-between px-5 py-3 pt-5 bg-gray-200 `,
              ]}>
              <View style={[tw`w-8/12 flex-row gap-4 items-center `]}>
                <Image
                  source={{uri: rideConfirmedDriver?.avatar}}
                  style={tw`w-13 aspect-square rounded-full`}
                />
                <View style={[tw` justify-center items-center `]}>
                  <Text
                    style={[
                      tw` text-lg font-medium`,
                      {fontFamily: 'Quicksand-Bold'},
                    ]}>
                    {rideConfirmedDriver?.name}
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
                    <View
                      style={[tw`bg-blue-400 p-2 rounded-full items-center`]}>
                      <Icon
                        style={[tw` z-50`]}
                        name="message"
                        size={25}
                        color={'black'}
                      />
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight>
                    <View
                      style={[tw`bg-blue-400 p-2 rounded-full items-center`]}>
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
                  {pickUplocationstate?.formatted}
                </Text>
              </View>
              <View style={[tw` flex flex-row gap-6  items-center`]}>
                <MaterialIcons name="pin-drop" size={25} color="black" />
                <Text style={[tw`font-medium w-10/12  py-3  `]}>
                  {dropLocationstate?.formatted}
                </Text>
              </View>

              {/* absolute line */}
              <View
                style={[
                  tw`absolute top-12 left-[9.5%] bg-black h-[25%] w-[1px]`,
                ]}></View>
            </View>
          </View>


          <View>
            <Text style={[tw` text-center pt-4 pb-2 text-blue-700  font-bold`,{fontFamily: 'Quicksand-Bold'}]}>Driver will arrive in 1 minutes</Text>
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
                Cancel ride
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
