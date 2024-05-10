import React from 'react'
import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '@/frontend/lib/supabase'
import Auth from '@/frontend/components/Auth'
import Account from '@/frontend/components/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Stack } from 'expo-router'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    

    // not sure what this does, but its from here: https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native?queryGroups=auth-store&auth-store=async-storage#launch
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View>
      <Stack.Screen options={{title: 'Log In', headerShown: true, headerBackTitleVisible: false}} />
      {/* <Auth /> */}
      {/* {session && session.user ? <VerifyPhone /> : <Auth />} */}
      {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
    </View>
  )
}