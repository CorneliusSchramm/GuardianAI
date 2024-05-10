import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState } from 'react-native'
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

export default function VerifyPhone() {
  const [phone, setPhone] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)

  async function updatePhone() {
    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      phone: phone,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function verifyPhone() {
    setLoading(true)
    // const { error } = await supabase.auth.verifyOtp({
    //   phone: phone,
    //   token: token,
    //   type: 'sms'
    // })
    const error = null

    
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{title: 'Verify your phone number', headerShown: true, headerBackTitleVisible: false}} />

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Phone"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setPhone(text)}
          value={phone}
          placeholder="+1 234 456 7890"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Send SMS" disabled={loading} onPress={() => updatePhone()} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Token"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setToken(text)}
          value={token}
          secureTextEntry={true}
          placeholder="Token"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Verify" disabled={loading} onPress={() => router.navigate('/call-forwarding')} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})