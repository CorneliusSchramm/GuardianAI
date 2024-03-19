import React from "react";
import { useEffect, useState } from 'react';
import { View, Text,StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [sound, setSound] = useState<Audio.Sound | undefined>();

  async function playSound() {
    console.log('Loading Sound');
    const { sound:loadedSound } = await Audio.Sound.createAsync( require('@public/Hello.mp3')
    );
    setSound(loadedSound);
    
    console.log('Playing Sound');
    await loadedSound.playAsync();
  }

  useEffect(() => {
    return sound ? () => {
      console.log('Unloading Sound');
      sound.unloadAsync();
    } : undefined;
  }, [sound]);

  return (
    <View className="flex-1 bg-slate-100 dark:bg-slate-800">
      <Text className="text-3xl text-center native:text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-5xl p-7 text-green-600 dark:text-orange-300" >Record Audio Here 🎤</Text>
      <Button title="Play Sound" onPress={playSound} />
    </View>
  );
}


