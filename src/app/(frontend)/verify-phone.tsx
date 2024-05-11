import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState } from 'react-native'
import { supabase } from '@/frontend/lib/supabase'
import { Input } from 'react-native-elements'
import { Link, Stack, router } from 'expo-router'
import { Button } from 'react-native-ui-lib'
import { globalStyles } from './theme'
import { telnyx } from '@/backend/config/clients'

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
    // const { error } = await supabase.auth.updateUser({
    //   phone: phone,
    // })

    const response = await fetch('/api/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone: phone }
      )
    }).then(response => console.log(response))
    .catch(error => console.log(error))
    // const data = await response.json();
    
    
    // if (data.error) {
    //   Alert.alert(data.error)    
    // } else {
    //   Alert.alert('SMS sent to ' + phone)
    // }

    setLoading(false)
  }

  async function verifyPhone() {
    setLoading(true)
    // const { error } = await supabase.auth.verifyOtp({
    //   phone: phone,
    //   token: token,
    //   type: 'sms'
    // })
    const response = await fetch('/api/otp-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          phone: phone, 
          token: token,
          user_id: await supabase.auth.getUser().then(user => user.data.user.id)
        }
      )
    }).then(response => console.log(response))
    .catch(error => console.log(error))


    setLoading(false)
    router.navigate('/call-forwarding')
  }

  return (
    <View style={globalStyles.container}>
      <Stack.Screen options={{title: 'Verify your phone number', headerShown: true, headerBackTitleVisible: false}} />

      <View style={[globalStyles.verticallySpaced, globalStyles.mt20]}>
        <Input
          label="Phone"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setPhone(text)}
          value={phone}
          placeholder="+1 234 456 7890"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[globalStyles.verticallySpaced]}>
        <Button label="Send SMS" disabled={loading} onPress={() => updatePhone()} />
      </View>
      <View style={[globalStyles.verticallySpaced, globalStyles.mt20]}>
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
      <View style={globalStyles.verticallySpaced}>
        <Button label="Verify" disabled={loading} onPress={() => verifyPhone()} />
      </View>
    </View>
  )
}