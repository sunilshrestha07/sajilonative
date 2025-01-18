import React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';

// Import screens
import GetStarted from '../screens/GetStarted';
import Login from './Login';
import Signup from './Signup';
import CaptainLogin from './CaptainLogin';
import CaptainSignup from './CaptainSignup';
import Profile from '../screens/Profile';
import Home from '../screens/Home';

export default function FirstPage() {
  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const DrawerNavigator = () => (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          width: 270,
        },
      }}
      initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        options={{headerShown: false}}
        component={Home}
      />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {/* Authentication Screens */}
        {!currentUser && (
          <>
            <Stack.Screen name="GetStarted" component={GetStarted} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="CaptainLogin" component={CaptainLogin} />
            <Stack.Screen name="CaptainSignup" component={CaptainSignup} />
          </>
        )}
        {/* Main App Screens */}
        {currentUser && (
          <Stack.Screen name="Drawer" component={DrawerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
