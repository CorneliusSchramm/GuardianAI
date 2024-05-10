import { Stack, Tabs } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { supabase } from '@/frontend/lib/supabase';


export default function Settings() {
  return (
    <View>
      <Text>Settings</Text>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}