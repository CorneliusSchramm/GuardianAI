import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, Linking } from 'react-native'
import { supabase } from '@/frontend/lib/supabase'
import { Button, Input } from 'react-native-elements'
import { Link, Stack, router } from 'expo-router'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
// from: https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native?queryGroups=auth-store&auth-store=async-storage#set-up-a-login-component
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function SetupCallForwarding() {

  return (
    <View>
      <Stack.Screen options={{ title: 'Setup Call Forwarding', headerShown: true, headerBackTitleVisible: false }} />

      <Button title='Settings' onPress={() => Linking.openURL('App-Prefs:Phone')}/>

      <Button title='Test Call'/>
      <Button title='Finish Setup' onPress={() => router.replace("/home")}/>

    </View>
  )
}
