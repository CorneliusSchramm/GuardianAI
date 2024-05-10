import React from "react";
import "../global.css";
import { Slot, Stack, Tabs } from "expo-router";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from "@/frontend/components/Auth";
import Home from "./(frontend)/home/home";
import Settings from "./(frontend)/home/settings";


export default function Layout() {
  return <Stack
    screenOptions={{
      headerShown: false,
      headerBackTitleVisible: true,
      // headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}/>;
}
