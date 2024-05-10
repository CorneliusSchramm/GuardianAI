import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function CallHistory() {
  return (
    <View>
      <Tabs.Screen
        options={{
          title: 'Call History',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="history" color={color} />,
        }}
      />

      <Text>Call history</Text>
    </View>
  );
}