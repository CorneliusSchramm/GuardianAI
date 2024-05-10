import { Stack, Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function Settings() {
  return (
    <View>
      <Tabs.Screen
        options={{
          headerShown: false,
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="gear" color={color} />,
        }}
      />
      <Text>Settings</Text>
    </View>
  );
}