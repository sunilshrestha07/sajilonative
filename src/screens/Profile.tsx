import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import * as ImagePicker from 'react-native-image-picker';
import {Image} from 'moti';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../assets/colors';
import axios from 'axios';
import {loginSuccess} from '../../redux/userSlice';

export default function Profile() {
  const [selectedImage, setSelectedImage] = React.useState<string>('');
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [name, setName] = useState<string>(currentUser?.name || '');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [password, setPassword] = useState<string>();
  const [avatarUri, setAvatarUri] = useState<string>('');
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isImageSelected, setImageSelected] = useState<boolean>(false);
  const [isImageBeingUploaded, setImageBeingUploaded] =
    useState<boolean>(false);

  // Function to select an image from the device
  const cameraOptionAlert = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Camera',
          onPress: () => openCamera(),
        },
        {
          text: 'Gallery',
          onPress: () => {
            selectImage();
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  const selectImage = async () => {
    //handel camera option selection
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
    });

    if (result.didCancel) {
      console.log('image selection cancelled');
    } else {
      setImageSelected(true);
      const imageUri = result.assets && result.assets[0]?.uri;
      if (imageUri) {
        setSelectedImage(imageUri);
        uploadImage(imageUri); // Show the selected image
      }
    }
  };

  //handel camera picker
  const openCamera = async () => {
    const result = await ImagePicker.launchCamera({
      mediaType: 'photo',
      includeBase64: false,
    });
    if (result.didCancel) {
      console.log('image selection cancelled');
    } else {
      setImageSelected(true);
      const imageUri = result.assets && result.assets[0]?.uri;
      if (imageUri) {
        setSelectedImage(imageUri);
        uploadImage(imageUri); // Show the selected image
      }
    }
  };

  //handel upload image to cloudnary
  const uploadImage = async (imageUri: string) => {
    setImageSelected(true);
    setImageBeingUploaded(true);
    try {
      const formdata = new FormData();
      formdata.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
      formdata.append('upload_preset', 'newsuneelpreset');

      // Cloudinary API URL (replace with your Cloud name)
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dogr0idrb/image/upload',
        {
          method: 'POST',
          body: formdata,
        },
      );
      const data = await response.json();
      const imageUrl = data.secure_url;
      console.log(imageUrl);
      setAvatarUri(imageUrl);
      setImageBeingUploaded(false);
    } catch (error) {
      console.log('Error uploading image:', error);
    }
  };

  //handel update profile
  const updateProfile = async () => {
    setIsUpdating(true);

    // Ensure avatarUri is set before continuing
    if (isImageSelected && !avatarUri) {
      Alert.alert('Please wait', 'Your avatar image is being uploaded...');
      setIsUpdating(false);
      return;
    }

    try {
      // Prepare form data for submission
      const formdata: any = {};

      if (name !== currentUser?.name) formdata.name = name;
      if (email !== currentUser?.email) formdata.email = email;
      if (phone !== currentUser?.phone) formdata.phone = phone;
      if (password) formdata.password = password;
      if (avatarUri) formdata.avatar = avatarUri;

      const res = await axios.put(
        `https://sajiloride.vercel.app/api/user/${currentUser?._id}`,
        formdata,
      );

      // Dispatch action to update the user profile in Redux
      dispatch(loginSuccess(res.data.user));
      setIsUpdating(false);
    } catch (error: any) {
      console.log('Error updating profile:', error.message);
      Alert.alert('Error updating profile', error.message);
      setIsUpdating(false);
    }
  };



  return (
    <View>
      <View>
        {/* //avatar of the user */}
        <View
          style={[
            tw` w-full flex-row items-center justify-center mt-5 relative`,
          ]}>
          <View
            style={[
              tw` w-40 h-40 bg-white border-[1px] border-gray-500 rounded-full overflow-hidden relative ${
                isImageBeingUploaded ? 'opacity-50' : ''
              }`,
            ]}>
            <Pressable onPress={() => cameraOptionAlert()}>
              <Image
                source={{
                  uri: selectedImage ? selectedImage : currentUser?.avatar,
                }}
                style={[tw` w-full aspect-square `, {resizeMode: 'cover'}]}
              />
              <Icon
                style={[
                  tw`absolute bottom-4 right-4 z-40 bg-white p-1 rounded-full`,
                ]}
                name="add"
                size={25}
                color="black"
              />
              {isImageBeingUploaded && (
                <View
                  style={[
                    tw`absolute top-0 left-0 w-full h-full  flex items-center justify-center`,
                  ]}>
                  <ActivityIndicator size="large" color="black" />
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* //user info */}
        <View style={[tw` px-6 mt-5 flex-col gap-5`]}>
          <View
            style={[
              tw` w-full flex-row gap-3 items-center border-[1px] border-gray-500 rounded-xl px-2`,
            ]}>
            <Icon name="person" size={24} color="black" />
            <TextInput
              onChangeText={text => setName(text)}
              defaultValue={currentUser?.name}
              placeholder="Name"
              placeholderTextColor={'gray'}
              style={tw`text-xl  text-black  p-2  w-10/12`}
            />
          </View>
          <View
            style={[
              tw` w-full flex-row gap-3 items-center border-[1px] border-gray-500 rounded-xl px-2`,
            ]}>
            <Icon name="email" size={24} color="black" />
            <TextInput
              numberOfLines={1}
              onChangeText={text => setEmail(text)}
              defaultValue={currentUser?.email}
              placeholder="email"
              placeholderTextColor={'gray'}
              style={tw`text-start text-xl  text-black  p-2  w-10/12`}
            />
          </View>
          <View
            style={[
              tw` w-full flex-row gap-3 items-center border-[1px] border-gray-500 rounded-xl px-2`,
            ]}>
            <Icon name="phone" size={24} color="black" />
            <TextInput
              onChangeText={text => setPhone(text)}
              defaultValue={currentUser?.phone}
              placeholder="phone number"
              placeholderTextColor={'gray'}
              style={tw`text-start text-xl  text-black  p-2  w-10/12`}
            />
          </View>
          <View
            style={[
              tw` w-full flex-row gap-3 items-center border-[1px] border-gray-500 rounded-xl px-2`,
            ]}>
            <Icon name="password" size={24} color="black" />
            <TextInput
              secureTextEntry
              onChangeText={text => setPassword(text)}
              placeholder="*********"
              placeholderTextColor={'gray'}
              style={tw`text-start text-xl  text-black  p-2  w-10/12`}
            />
          </View>
        </View>

        {/* //save button */}
        <View style={[tw` w-full flex-row items-center justify-center `]}>
          <Pressable
            disabled={isUpdating || isImageBeingUploaded}
            onPress={updateProfile}
            style={[
              tw` w-6/12 py-3 rounded-lg flex-row items-center justify-center mt-10 `,
              {backgroundColor: colors.primary},
            ]}>
            {isUpdating ? (
              <ActivityIndicator
                style={[tw` py-1`]}
                size="small"
                color="white"
              />
            ) : (
              <Text
                style={[
                  tw` text-center text-white  text-base  font-medium   `,
                  ,
                ]}>
                Save
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
