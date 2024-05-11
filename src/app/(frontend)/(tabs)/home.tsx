import { Stack, Tabs } from 'expo-router';
import React from 'react';
import { Text, View, StyleSheet} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors,  } from 'react-native-ui-lib';
import { globalStyles } from '../theme';
import PushPage from '@/frontend/components/Push';


export default function Home() {
  return (
    <View style={globalStyles.container}>

      <Text>Home is where the domw is</Text>
      {/* <PushPage/> */}
    </View>
  );
}