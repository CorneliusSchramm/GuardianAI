import React from "react";
import "../../../../global.css";
import { Slot, Stack, Tabs } from "expo-router";


export default function Layout() {
  return(
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: true,
        // headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />);
}