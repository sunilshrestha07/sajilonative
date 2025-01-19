import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import ContinueAsDriver from '../components/ContinueAsDriver';
import CaptainSignup from '../(auth)/CaptainSignup';
import CaptainLogin from '../(auth)/CaptainLogin';

export default function DriverMode() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationIndependentTree>
      <NavigationContainer
        initialState={{routes: [{name: 'ContinueAsDriver'}]}}>
        <Stack.Navigator>
          <Stack.Screen
            name="ContinueAsDriver"
            // options={{title: ''}}
            component={ContinueAsDriver}
          />
          <Stack.Screen
            name="captainsignup"
            options={{title: ''}}
            component={CaptainSignup}
          />
          <Stack.Screen
            name="captainlogin"
            options={{title: ''}}
            component={CaptainLogin}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({});
