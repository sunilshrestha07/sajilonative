import {Alert, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import tw from 'twrnc';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {logout} from '../../redux/userSlice';
import {useIsFocused} from '@react-navigation/native';
import {Image} from 'moti';

export default function CustomeDrawer(props: any) {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();

  //handel logout confirm popup
  const handelLogoutConfirm = () => {
    setTimeout(() => {
      Alert.alert(
        'Confirm Logout',
        'Are you sure you want to logout?',
        [
          {
            text: 'No',
            onPress: () => console.log('Cancelled'),
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              console.log('Logging out...');
              dispatch(logout()); // Call the logout action
            },
          },
        ],
        {cancelable: false},
      );
    }, 100); // Small delay to ensure UI is stable
  };

  return (
    <View style={{flex: 1}}>
      <StatusBar translucent backgroundColor="transparent" />
      <DrawerContentScrollView {...props}>
        <View
          style={[
            tw` overflow-hidden flex flex-row gap-3 items-center h-20   `,
          ]}>
          <View ></View>
          {currentUser && <Image style={[tw` w-14 aspect-square rounded-full object-cover overflow-hidden border-2 border-gray-300`]} source={{uri: currentUser?.avatar}} />}
          <View>
            {currentUser && (
              <View>
                <Text style={tw` text-xl font-semibold`}>
                  {currentUser.name}
                </Text>
                <Text style={tw` text-sm opacity-70`}>{currentUser.email}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={[tw` py-2 flex flex-col gap-4`]}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View>
        <View>
          <TouchableOpacity
            style={[
              tw`h-12 flex flex-row items-center justify-center gap-2 bg-gray-200`,
            ]}
            onPress={handelLogoutConfirm}>
            <Icon name="logout" size={20} color={'black'} />
            <Text style={tw`text-black text-lg font-semibold`}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
