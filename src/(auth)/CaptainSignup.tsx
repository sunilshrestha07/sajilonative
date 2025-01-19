import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import useDarkMode from '../hooks/useDarkMode';
import tw from 'twrnc';
import colors from '../../assets/colors';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';

export default function CaptainSignup({navigation}: any) {
  const isDark = useDarkMode();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [plate, setPlate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isErrorActive, setIsErrorActive] = useState<boolean>(false);

  const handleSignup = async () => {
    try {
      setIsSubmitting(true);
      const formdata = {
        name,
        email,
        phone,
        password,
        role: 'captain',
        vehicle:{
          color,
          plate,
          vehicleType,
        },
      };
      const res = await axios.post('https://sajiloride.vercel.app/api/user/usersignup',formdata)
      setName('');
      setEmail('');
      setPassword('');
      setColor('');
      setPhone('');
      setPlate('');
      setVehicleType('');
      setIsSubmitting(false);
      navigation.navigate('CaptainLogin');
      // Alert.alert('captain signup success');
    } catch (error: any) {
      setIsSubmitting(false);
      Alert.alert(`Error signup captain ${error.message}`);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <Text style={styles.textstyle}>SajiloRide</Text>

      <View style={[tw`flex-1 w-full h-full px-3`]}>
        <View>
          <Text
            style={[
              tw`text-left text-xl  pt-5`,
              {fontFamily: 'Quicksand-Bold'},
            ]}>
            Captain Information
          </Text>
        </View>
        <View style={[tw`py-5 gap-3`]}>
          <View>
            <Text
              style={[
                tw`text-lg font-medium ${isDark ? "text-gray-300":"text-gray-600"}`,
                {fontFamily: 'Quicksand-Bold'},
              ]}>
              Name
            </Text>
            <TextInput
              placeholder="Userone"
              value={name}
              onChangeText={setName}
              style={tw`border-[1px] border-gray-300 p-3 bg-gray-200 rounded-md`}
            />
          </View>
          <View>
            <Text
              style={[
                tw`text-lg font-medium ${isDark ? "text-gray-300":"text-gray-700"}`,
                {fontFamily: 'Quicksand-Bold'},
              ]}>
              Email
            </Text>
            <TextInput
              placeholder="userone@gmail.com"
              value={email}
              onChangeText={setEmail}
              style={tw`border-[1px] border-gray-300 p-3 bg-gray-200 rounded-md`}
            />
          </View>
          <View>
            <Text
              style={[
                tw`text-lg font-medium ${isDark ? "text-gray-300":"text-gray-700"}`,
                {fontFamily: 'Quicksand-Bold'},
              ]}>
              Phone
            </Text>
            <TextInput
              placeholder="userone@gmail.com"
              value={phone}
              onChangeText={setPhone}
              style={tw`border-[1px] border-gray-300 p-3 bg-gray-200 rounded-md`}
            />
          </View>
          <View>
            <Text
              style={[
                tw`text-lg font-medium ${isDark ? "text-gray-300":"text-gray-700"}`,
                {fontFamily: 'Quicksand-Bold'},
              ]}>
              Password
            </Text>
            <TextInput
              secureTextEntry
              placeholder="*********"
              value={password}
              onChangeText={setPassword}
              style={tw`border-[1px] border-gray-300 p-3 bg-gray-200 rounded-md`}
            />
          </View>
          <View>
            <Text style={[tw`mt-5 text-xl `, {fontFamily: 'Quicksand-Bold'}]}>
              Vehicle Information
            </Text>
            <View style={[tw`flex-row justify-between w-full py-3`]}>
              <View style={[tw` w-30% gap-2 `]}>
                <Text style={tw`${isDark ? "text-gray-300":"text-gray-700"}`}>Number Plate</Text>
                <TextInput
                  value={plate}
                  onChangeText={setPlate}
                  placeholder="ABC123"
                  style={tw`border-[1px] border-gray-300 p-2 bg-gray-200 rounded-md`}
                />
              </View>
              <View style={[tw` w-30% gap-2`]}>
                <Text style={tw`${isDark ? "text-gray-300":"text-gray-700"}`}>Vehicle color</Text>
                <TextInput
                  value={color}
                  onChangeText={setColor}
                  placeholder="Red"
                  style={tw`border-[1px] border-gray-300 p-2 bg-gray-200 rounded-md`}
                />
              </View>
              <View style={[tw` w-30% rounded-md overflow-hidden  gap-2`]}>
                <Text style={tw`${isDark ? "text-gray-300":"text-gray-700"}`}>Vehicle type</Text>
                <View
                  style={[
                    tw` w-full rounded-md overflow-hidden h-10 border-[1px] border-gray-300 `,
                  ]}>
                  <Picker
                    selectedValue={vehicleType}
                    onValueChange={itemValue => setVehicleType(itemValue)}
                    style={[
                      tw`border-[1px] border-gray-300  bg-gray-200 text-base rounded-md -mt-2`,
                    ]}>
                    <Picker.Item label="Car" value="car" />
                    <Picker.Item label="Bike" value="bike" />
                  </Picker>
                </View>
              </View>
            </View>
          </View>

          <View style={[tw`flex items-center mt-5`]}>
            <TouchableOpacity
              style={[tw`flex items-center w-full`]}
              onPress={handleSignup}>
              <View
                style={[
                  tw` py-3 w-6/12 rounded-md`,
                  {backgroundColor: colors.primary},
                ]}>
                {isSubmitting ? (
                  <ActivityIndicator
                    style={[tw` py-1`]}
                    size="small"
                    color={colors.secondary}
                  />
                ) : (
                  <Text
                    style={[
                      tw`text-lg font-medium  text-center`,
                      {fontFamily: 'Quicksand-Bold',color:colors.secondary},
                    ]}>
                    Signup
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
          {isErrorActive && (
            <Text>
              <Text
                style={[
                  tw`text-base font-medium text-red-500 text-center`,
                  {fontFamily: 'Quicksand-Bold'},
                ]}>
                Signup failed. Please try again.
              </Text>
            </Text>
          )}
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.replace('CaptainLogin');
              }}>
              <Text
                style={[
                  tw`${isDark ? "text-gray-300":"text-gray-700"} text-center`,
                  {fontFamily: 'Quicksand-VariableFont_wght'},
                ]}>
                Already have an captain account? Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColorNormal,
  },
  textstyle: {
    fontFamily: 'JimNightshade-Regular',
    fontSize: 45,
    textAlign: 'center',
  },
});
