import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  Touchable,
  TouchableHighlight,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import useDarkMode from '../hooks/useDarkMode';
import tw from 'twrnc';
import colors from '../../assets/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {setIsPopUpActive} from '../../redux/globalSlice';
import {RootState} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';

export default function PaymentPopUp() {
  const isDark = useDarkMode();
  const socket = useSelector((state: RootState) => state.socket.socket);
  const dispatch = useDispatch()
  const totalPrice = useSelector((state: RootState) => state.global.totalPrice);

  useEffect(() => {
    if (!socket) return;
     socket.on('rideCompleted', () => {
          console.log('ride has been  completed');
          // dispatch(setIsRideCompleted());
          // dispatch(setIsRideBooked());
          dispatch(setIsPopUpActive());
        });
    return () => {
      socket.off('rideCompleted');
    };
  }, []);

  //handel close setIsPopUpActive
  const handelClose = () => {
    dispatch(setIsPopUpActive());
  }
  return (
    <View>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />
      <View
        style={[tw` p-4  h-full  `, {backgroundColor: 'rgba(0, 0, 0, 0.7)'}]}>
        <View
          style={[
            tw` px-4 py-6 flex flex-col gap-4  w-full relative rounded-xl overflow-hidden mt-60 `,
            {backgroundColor: colors.primary},
          ]}>
          <View>
            <Text style={[tw`text-2xl font-semibold text-white text-center`]}>
              Payment
            </Text>
          </View>
          <View style={[tw` w-full h-0.5 bg-white  `]}></View>
          <View>
            <Text
              style={[
                tw`text-4xl py-2 font-semibold text-white text-center flex items-center`,
              ]}>
              रु {totalPrice}
            </Text>
            <View>
              <Text
                style={[tw`text-base font-semibold text-white text-center`]}>
                This is the total trip fare amount .Please pay to the driver
              </Text>
            </View>
          </View>
          <View style={[tw`px-10`]}>
            <TouchableHighlight style={[tw`bg-green-500 p-2 rounded-lg`]}>
              <Text style={[tw`text-2xl font-semibold text-white text-center`]}>
                Pay Now
              </Text>
            </TouchableHighlight>
          </View>

          {/* //close icon */}
          <View style={[tw`absolute w-10 top-4 right-3`]}>
            <Pressable onPress={handelClose}>
              <Icon name="close" size={30} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
