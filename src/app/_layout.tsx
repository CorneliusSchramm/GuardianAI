import React from "react";
import "../global.css";
import { Slot, Stack, Tabs } from "expo-router";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from "@/frontend/components/Auth";
import Home from "./(frontend)/(tabs)/home";
import Settings from "./(frontend)/(tabs)/settings";
import QueryProvider from "@/frontend/providers/QueryProvider";


export default function Layout() {
  return(
  <QueryProvider>
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: true,
        // headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />
  </QueryProvider>);
}