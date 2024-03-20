import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [sound, setSound] = useState<Audio.Sound | undefined>();
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordedSound, setRecordedSound] = useState<Audio.Sound | undefined>();

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
  }, []);

  async function playSound() {
    console.log('Loading Sound');
    try {
      const { sound: loadedSound, status } = await Audio.Sound.createAsync(
        require('@assets/Hello.mp3') // Ensure the path is correct
      );
      setSound(loadedSound);

      console.log('Playing Sound');
      await loadedSound.playAsync();
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  }

  useEffect(() => {
    return sound ? () => {
      console.log('Unloading Sound');
      sound.unloadAsync();
    } : undefined;
  }, [sound]);

  async function startRecording() {
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording: recordedAudio } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recordedAudio);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    const { sound: recordedSound } = await Audio.Sound.createAsync({ uri });
    setRecordedSound(recordedSound);
  }

  async function playRecordedSound() {
    console.log('Playing recorded sound');
    if (recordedSound !== undefined) {
      await recordedSound.playAsync();
    }
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-black">
      <Text className="native:text-3xl text-center font-bold pt-3 text-gray-700 dark:text-orange-300" > Audio Playground 🎤</Text>
      <Button title="Play Music" onPress={playSound} />
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <Button title="Play Recorded Sound" onPress={playRecordedSound} disabled={recordedSound === undefined} />
    </View>
  );
}


