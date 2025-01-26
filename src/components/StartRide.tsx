import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {Image} from 'moti';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {setIsCancelRideTrue, setIsFindRoutesActive, setIsRideBooked, setIsRideCompleted} from '../../redux/globalSlice';
import {rideBookedUserEmpty} from '../../redux/rideSlice';
import {
  setendingLocation,
  setstartingLocation,
} from '../../redux/locationSlice';
import axios from 'axios';

export default function StartRide() {
  const rideConfirmedUser = useSelector(
    (state: RootState) => state.ride.rideConfirmedUser,
  );
  const dispatch = useDispatch();
  const socketDriver = useSelector(
    (state: RootState) => state.socket.socketDriver,
  );
  const [isRideStarted, setIsRideStarted] = useState(false);
  const currentUser=useSelector((state:RootState)=>state.user.currentUser)

  //useeffecf for socket
  useEffect(() => {
    if (!socketDriver) return;

    socketDriver.on('rideHasBeenCancled', ({formdata}) => {
      console.log('ride has been calcled by user');
      dispatch(rideBookedUserEmpty());
      dispatch(setIsRideBooked());
      Alert.alert(`ride has been calcled by user ${formdata.name}`);
    });

    return () => {
      socketDriver.off('rideHasBeenCancled');
      socketDriver.off('rideCompleted');
      socketDriver.off('rideStarted');
    };
  }, [socketDriver]);

  //handel canle ride click event
  const handelRideStart = () => {
    //if the rideconfirmed is available only then dispatch to the stating data
    if (rideConfirmedUser) {
      dispatch(setstartingLocation(rideConfirmedUser?.pickuplocation));
      dispatch(setendingLocation(rideConfirmedUser?.droplocation));
    }
    dispatch(setIsFindRoutesActive())
    //driver data already saved hune bhayara ra yo yesai pathako tyo driverdata ma
    const driverdata = {
      name: 'sajilo',
    };
    setIsRideStarted(true);
    socketDriver?.emit('rideStarted', {
      driverdata,
      userId: rideConfirmedUser?.id,
    });
    addrideToDb()
  };

  //handel data to post in db
  const addrideToDb= async () => {
    const formdata={
      price:rideConfirmedUser?.price,
      distance:rideConfirmedUser?.distance,
      driverId:currentUser?._id,
      userId:rideConfirmedUser?.id,
      droplocation:rideConfirmedUser?.droplocation.name,
      pickuplocation:rideConfirmedUser?.pickuplocation.name
    }
    try {
      const res = await axios.post(`https://sajiloride.vercel.app/api/rides`,formdata);
      console.log('res',res.data.ride);
      console.log('addedto db');
    } catch (error:any) {
      console.log('error in adding',error.message);

    }
  }

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
            handelComplete();
          },
        },
      ],
      {cancelable: false},
    );
  };

  //handel logout
  const handelComplete = () => {
    console.log('Ride completed');
    //driver data already saved hune bhayara ra yo yesai pathako tyo driverdata ma userkai
    socketDriver?.emit('rideCompleted', {
      driverdata: rideConfirmedUser,
      userId: rideConfirmedUser?.id,
    });
    dispatch(setIsRideBooked());
    dispatch(setIsRideCompleted());
  };

  return (
    <View style={[tw` w-full h-full rounded-lg overflow-hidden  `]}>
      <View>
        {/* //this the profile and message and call bar */}
        <View>
          <View
            style={[
              tw` w-full  flex-row items-center justify-between px-5 py-3 bg-gray-200 `,
            ]}>
            <View style={[tw`w-8/12 flex-row gap-4 items-center `]}>
              <Image
                source={{uri: rideConfirmedUser?.avatar}}
                style={tw`w-13 aspect-square rounded-full`}
              />
              <View style={[tw` justify-center items-center `]}>
                <Text
                  style={[
                    tw` text-lg font-bold`,
                    {fontFamily: 'Quicksand-Bold'},
                  ]}>
                  {rideConfirmedUser?.name}
                </Text>
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
        <View style={[tw`w-100% px-5 mt-4 `]}>
          {isRideStarted ? (
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
          ) : (
            <TouchableHighlight
              onPress={handelRideStart}
              style={[tw`w-100% rounded-lg bg-black overflow-hidden`]}>
              <Text
                style={[
                  tw`text-lg  font-semibold  text-white py-3 text-center `,
                ]}>
                Start Ride
              </Text>
            </TouchableHighlight>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
