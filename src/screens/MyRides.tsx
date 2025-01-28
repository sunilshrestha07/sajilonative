import {ActivityIndicator, FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import moment from 'moment';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ridesInterface {
  _id: string;
  driverId: string;
  userId: string;
  pickuplocation: string;
  droplocation: string;
  distance: number;
  price: number;
  createdAt: string;
}

export default function MyRides() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [allRides, setAllRides] = useState<ridesInterface[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const fetchRides = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get(
        `https://sajiloride.vercel.app/api/rides/${currentUser?._id}`,
      );
      setAllRides(res.data.rides);
      setIsFetching(false)
    } catch (error) {
      console.log(error);
      setIsFetching(false)
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);
  return (
    <>
      <View>
        {allRides.length > 0 ? (
          <View>
            {isFetching &&
            <ActivityIndicator
              size="large"
              color="black"
            />
            }
            <FlatList
              data={allRides}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <View
                  style={[
                    tw`w-full  px-2 py-3 border-b-[1px] border-gray-300`,
                  ]}>
                  <View
                    style={[tw`flex flex-row items-center justify-between`]}>
                    <View>
                      <Text style={[tw`font-bold text-base`]}>
                        {moment(item.createdAt).format('DD MMM, hh:mm A')}
                      </Text>
                    </View>
                    <View>
                      <Text style={[tw`font-bold text-base`]}>
                        Rs{item.price}
                      </Text>
                    </View>
                  </View>

                  {/* //shwo the locaiton info */}
                  <View style={[tw`flex flex-col gap-1 mt-1`]}>
                    <View
                      style={[
                        tw` flex flex-row gap-1 w-full p-1 items-center`,
                      ]}>
                      <Icon
                        name="radio-button-checked"
                        size={20}
                        color="#4C82D2"
                      />
                      <Text
                        numberOfLines={1}
                        style={[tw`font-normal text-base `]}>
                        {item.pickuplocation}
                      </Text>
                    </View>
                    <View
                      style={[
                        tw` flex flex-row gap-1 w-full px-1 items-center`,
                      ]}>
                      <Icon
                        name="radio-button-checked"
                        size={20}
                        color="green"
                      />
                      <Text
                        numberOfLines={1}
                        style={[tw`font-normal text-base `]}>
                        {item.droplocation}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        ) : (
          <View style={[tw`w-full items-center`]}>
            <Text style={[tw`font-bold text-2xl mt-6 text-center w-full`]}>
              You have no rides till now
            </Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
