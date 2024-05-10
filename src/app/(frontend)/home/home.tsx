import { Stack, Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function Home() {
  return (
    <View>
        <Tabs.Screen
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />

      <Text>Home</Text>
    </View>
  );
}