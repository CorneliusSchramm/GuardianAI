import React from "react";
import "../../../global.css";
import { Slot, Stack, Tabs } from "expo-router";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from "@/frontend/components/Auth";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tab } from "react-native-elements";



export default function Layout() {
  return <Tabs>
    <Tabs.Screen
      name='home'
      options={{
        title: 'Home',
        headerShown: false,
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
      }}
    />
    <Tabs.Screen
      name='calls'
      options={{
        title: 'Call History',
        headerShown: false,
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="history" color={color} />,
      }}
    />
    <Tabs.Screen
      name="settings"
      options={{
        headerShown: false,
        title: 'Settings',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="gear" color={color} />,
      }}
    />
    {/* <Tabs.Screen name='calls/[call_id]' options={{href:null}} /> */}
  </Tabs>;
}

