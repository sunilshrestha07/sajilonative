import {Animated, Easing, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, { useEffect } from 'react';
import FirstPage from './src/(auth)/FirstPage';
import useDarkMode from './src/hooks/useDarkMode';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {persistor, store} from './redux/store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';

export default function App() {
  const scaleAnim = new Animated.Value(1);  // Initially a circle, full size
  const opacityAnim = new Animated.Value(1);  // Start with visible logo

  useEffect(() => {
    SplashScreen.hide();  // Hide the native splash screen

    // Animate the circle to expand to full screen
    Animated.timing(scaleAnim, {
      toValue: 50,  // Expand the circle to the screen size (adjust this value)
      duration: 1500,  // Animation duration (1 second)
      easing: Easing.ease,  // Easing function for smooth animation
      useNativeDriver: false,
    }).start();

    // Fade out the logo during the animation
    Animated.timing(opacityAnim, {
      toValue: 0,  // Fade out
      duration: 500,  // Fade out duration
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <FirstPage />
          </View>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
