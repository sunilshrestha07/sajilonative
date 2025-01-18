import {StatusBar, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import useDarkMode from '../hooks/useDarkMode';
import tw from 'twrnc';
import colors from '../../assets/colors';
import axios from 'axios';

export default function Signup({navigation}:any) {
  const isDark = useDarkMode();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isErrorActive, setIsErrorActive] = useState<boolean>(false);

  const handleSignup = async () => {
    try {
      setIsSubmitting(true);
      const formdata ={
        name,
        email,
        password
      }
      const res = await axios.post('https://sajiloride.vercel.app/api/user/usersignup',formdata)
      setName('')
      setEmail('')
      setPassword('')
      setPhone('')
      setIsSubmitting(false)

      //if the signup is successful, navigate to the home screen
      navigation.navigate('Home')
    } catch (error:any) {
      setIsSubmitting(false);
      Alert.alert("Error signingup", error.message);
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
              tw`text-left text-3xl  pt-10 pb-3`,
              {fontFamily: 'Quicksand-Bold'},
            ]}>
            Signup
          </Text>
        </View>
        <View style={[tw`py-5 gap-3`]}>
          <View>
            <Text style={[tw`text-lg font-medium ${isDark ? "text-gray-300":"text-gray-700"}`,{fontFamily:'Quicksand-Bold'}]}>Name</Text>
            <TextInput
              placeholder="Userone"
              value={name}
              onChangeText={setName}
              style={tw`border-[1px] border-gray-300 p-3 bg-gray-200 rounded-md`}
            />
          </View>
          <View>
            <Text style={[tw`text-lg font-medium ${isDark ? "text-gray-300":"text-gray-700"}`,{fontFamily:'Quicksand-Bold'}]}>Email</Text>
            <TextInput
              placeholder="userone@gmail.com"
              value={email}
              onChangeText={setEmail}
              style={tw`border-[1px] border-gray-300 p-3 bg-gray-200 rounded-md`}
            />
          </View>
          <View>
            <Text style={[tw`text-lg font-medium ${isDark ? "text-gray-300":"text-gray-700"}`,{fontFamily:'Quicksand-Bold'}]}>Phone</Text>
            <TextInput
              placeholder="9841849721"
              value={phone}
              onChangeText={setPhone}
              style={tw`border-[1px] border-gray-300 p-3 bg-gray-200 rounded-md`}
            />
          </View>
          <View>
            <Text style={[tw`text-lg font-medium ${isDark ? "text-gray-300":"text-gray-700"}`,{fontFamily:'Quicksand-Bold'}]}>Password</Text>
            <TextInput
              secureTextEntry
              placeholder="*********"
              value={password}
              onChangeText={setPassword}
              style={tw`border-[1px] border-gray-300 p-3 bg-gray-200 rounded-md`}
            />
          </View>

          <View style={[tw`flex items-center mt-10`]}>
            <TouchableOpacity style={[tw`flex items-center w-full`]} onPress={handleSignup}>
              <View style={[tw` py-3 w-6/12 rounded-md`, {backgroundColor: colors.primary}]}>
                {isSubmitting ? (
                  <ActivityIndicator style={[tw` py-1`]} size="small" color={colors.secondary} />
                ):(
                  <Text style={[tw`text-lg font-medium  text-center`,{fontFamily:'Quicksand-Bold',color:colors.secondary}]}>Signup</Text>
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
          <View >
            <TouchableOpacity onPress={() => {navigation.replace('Login')}}>
              <Text style={[tw`${isDark ? "text-gray-300":"text-gray-700"} text-center`,{fontFamily:'Quicksand-VariableFont_wght'}]}>Already have an account? Login</Text>
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
    marginTop: 20,
  },
});
