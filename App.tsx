import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FirstPage from './src/(auth)/FirstPage';
import useDarkMode from './src/hooks/useDarkMode';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {persistor, store} from './redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const isDark = useDarkMode();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PersistGate persistor={persistor}>
        <Provider store={store}>
          <View style={styles.container}>
            <StatusBar
              barStyle="dark-content"
            />
            <FirstPage />
          </View>
        </Provider>
      </PersistGate>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
