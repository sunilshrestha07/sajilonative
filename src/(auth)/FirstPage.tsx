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
import CustomeDrawer from '../components/CustomeDrawer';
import Setting from '../screens/Setting';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DriverMode from '../screens/DriverMode';

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
      drawerContent={props => <CustomeDrawer {...props} />}
      initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <Icon name="home" size={24} color="black" />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: () => <Icon name="person" size={24} color="black" />,
        }}
      />
      <Drawer.Screen
        name="Setting"
        component={Setting}
        options={{
          drawerIcon: () => <Icon name="settings" size={24} color="black" />,
        }}
      />
      <Drawer.Screen
        name="Driver Mode"
        component={DriverMode}
        options={{
          headerShown: false,
          drawerIcon: () => <Icon name="directions-car" size={24} color="black" />,
        }}
      />
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
