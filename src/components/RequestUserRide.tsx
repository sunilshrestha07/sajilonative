import {Alert, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { DataSendByUserInterface } from '../../declareInterface';
const _id = 'driver111'
const userId='user111'

export default function RequestUserRide() {
  const socket = io('https://socketiobackendtest-production.up.railway.app/', {
    transports: ['websocket'],
    auth: {
      drivertoken:_id,
    },
  });
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [userRideData,setUserRideData]=useState<DataSendByUserInterface[]>([])

  useEffect(() => {
    socket.on('broadCastDrives', ({userId}) => {
      console.log('requesting user is', userId);
      Alert.alert('requesting user is');
    //   setUserId(userId);
    })

    socket.on('driverIsRequesting', () => {
      console.log('driver made request to the user');

    })

    return () => {
      socket.off('broadCastDrives');
      socket.off('driverIsRequesting');
    }
  },[])

  const requestUser =()=>{
    socket.emit('driverRequest', {driverId: _id,user:currentUser?._id});
    console.log('made request to user',currentUser?._id);

  }
  return (
    <View style={[tw`w-100% items-center h-full bg-red-500`]}>
      <TouchableHighlight onPress={requestUser}>
        <Text
          style={[
            tw`text-center py-3 rounded-lg  text-base w-full font-medium bg-blue-500`,
          ]}>
          Request
        </Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({});
