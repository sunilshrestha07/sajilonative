import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, { useEffect } from 'react';
import FirstPage from './src/(auth)/FirstPage';
import useDarkMode from './src/hooks/useDarkMode';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {persistor, store} from './redux/store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';

export default function App() {
  const isDark = useDarkMode();

  useEffect(() => {
    SplashScreen.hide();
  },[])
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
