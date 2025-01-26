import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import colors from '../../assets/colors';
import tw from 'twrnc';

export default function GetStarted({navigation}:any) {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.backgroundColorNormal}
      />
      <Text style={styles.textstyle}>SajiloRide</Text>
      <View style={styles.rideViewBox}>
        <Image
          style={styles.rideImage}
          source={require('../../assets/images/sajilo.png')}
        />
      </View>
      <View>
        <Text style={styles.rideText}>Ride Smart, Ride Easy</Text>
        <Text style={[tw`text-center `,{fontFamily:'Quicksand-VariableFont_wght'}]}>Ride with Sajilo</Text>
      </View>
      <View style={tw` w-100% items-center gap-5 mt-20 `}>
        <View style={tw`w-70% `}>
          <TouchableOpacity onPress={()=>navigation.navigate('Signup')} >
            <Text
              style={[
                tw`text-center py-3 rounded-lg  text-base w-full font-medium border-[1px] border-black `,
                {backgroundColor:colors.primary,color:colors.secondary}
              ]}>
              Continue as User
            </Text>
          </TouchableOpacity>
        </View>
        <View style={tw`w-70%`}>
          <TouchableOpacity onPress={()=>navigation.navigate('CaptainSignup')} >
            <Text
              style={[
                tw` text-center py-3 rounded-lg  text-base w-full font-medium border-[1px] border-black bg-gray-200 `,
              ]}>
              Continue as Captain
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={tw`w-96% absolute bottom-5`}>
        <Text style={tw`text-center`}>
          Joining our app means you agree with our Terms of use Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColorNormal,
    alignItems: 'center',
  },
  textstyle: {
    fontFamily: 'JimNightshade-Regular',
    fontSize: 45,
    marginTop: 40,
  },
  rideViewBox: {
    width: '100%',
    height: '47%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rideImage: {
    width: '75%',
    height: '100%',
    objectFit: 'cover',
  },
  rideText: {
    fontFamily: 'Belgrano-Regular',
    fontSize: 20,
    marginTop: 5,
  },
});
