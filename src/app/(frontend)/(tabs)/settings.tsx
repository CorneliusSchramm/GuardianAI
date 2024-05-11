import { Stack, Tabs, router } from 'expo-router';
import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { supabase } from '@/frontend/lib/supabase';
import { Avatar, Colors, Button } from 'react-native-ui-lib';
import { globalStyles } from '@/app/(frontend)/theme';
import { useQuery } from '@tanstack/react-query';



export default function Settings() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['getUser'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }
  });

  const userMail = supabase.auth.getUser().then(user => user.data.user.email);

  return (
    <View style={globalStyles.container}>
      <View style={styles.profileInfo}>
        <Avatar
          size={100}
          label='MB'
          backgroundColor={Colors.$backgroundWarningLight}
          labelColor={Colors.$textMajor}
        // ribbonLabel='Member'
        // ribbonStyle={{ backgroundColor: Colors.purple30 }}
        />
        <Text style={{ marginTop: 10 }}>{user?.user.email}</Text>

      </View>
      <View style={globalStyles.verticallySpaced}>
        <Button label="Verify Phone" onPress={() => router.push("/verify-phone")} />
      </View>
      <View style={globalStyles.verticallySpaced}>
        <Button label="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileInfo: {
    flex: 2 / 4,
    marginBottom: 40,
    alignItems: 'center',
  },
});