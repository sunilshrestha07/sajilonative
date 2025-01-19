import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ContinueAsDriver({navigation}: any) {
  return (
    <View>
      <View style={[tw` w-full h-full relative `]}>
        {/* //get income box */}
        <View style={[tw` px-2`]}>
          <View
            style={[
              tw` w-full flex-row h-40 px-2 mt-4 bg-gray-200 p-5 rounded-2xl border-[1px] border-gray-500`,
            ]}>
            <View style={[tw`   w-6/12`]}>
              <Text
                style={[
                  tw`  text-xl font-bold `,
                  {fontFamily: 'Quicksand-Bold'},
                ]}>
                Get income with us
              </Text>
              <View style={[tw` flex flex-col gap-2 mt-4`]}>
                <View style={[tw` flex flex-row items-center gap-2`]}>
                  <Icon name="check-circle" size={20} color="black" />
                  <Text style={[tw` font-medium`]}>Flexibale hours</Text>
                </View>
                <View style={[tw` flex flex-row items-center gap-2`]}>
                  <Icon name="check-circle" size={20} color="black" />
                  <Text style={[tw` font-medium`]}>Resionable prices</Text>
                </View>
                <View style={[tw` flex flex-row items-center gap-2`]}>
                  <Icon name="check-circle" size={20} color="black" />
                  <Text style={[tw` font-medium`]}>Low service payments</Text>
                </View>
              </View>
            </View>

            {/* //image */}
            <View
              style={[
                tw` w-6/12 object-contain flex items-center justify-center  `,
              ]}>
              <Image
                style={[tw` w-full h-full object-contain`]}
                source={require('../../assets/images/driver.png')}
              />
            </View>
          </View>
        </View>

        {/* //select the vehicle options */}
        <View style={[tw` flex-col gap-2 absolute bottom-3 `]}>
          <View style={[tw` px-3  flex-col gap-10 `]}>
            <TouchableHighlight
            onPress={()=>navigation.navigate('captainlogin')}
              style={[tw` w-full bg-black  py-2 rounded-2xl overflow-hidden `]}>
              <Text
                style={[
                  tw`  text-white text-center text-lg `,
                  {fontFamily: 'Quicksand-Bold'},
                ]}>
                I already have an account
              </Text>
            </TouchableHighlight>
          </View>
          <View style={[tw` px-3  `]}>
            <TouchableHighlight
            onPress={()=>navigation.navigate('captainsignup')}
              style={[tw` w-full  py-2 rounded-2xl overflow-hidden `]}>
              <Text
                style={[
                  tw`  text-black text-center text-lg `,
                  {fontFamily: 'Quicksand-Bold'},
                ]}>
                Signup as Captain
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
