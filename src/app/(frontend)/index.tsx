import React from 'react'
import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '@/frontend/lib/supabase'
import Auth from '@/frontend/components/Auth'
import Account from '@/frontend/components/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Stack, router } from 'expo-router'

export default function App() {
  // const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/home");
      } else {
        console.log("no user");
      }
    })

    // not sure what this does, but its from here: https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native?queryGroups=auth-store&auth-store=async-storage#launch
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/home/");
      } else {
        console.log("no user");
        router.replace("/login");
      }
    })
  }, [])
}