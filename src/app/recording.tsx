import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet , TouchableOpacity} from "react-native";
import { Audio } from "expo-av";

export default function App() {
  const [sound, setSound] = useState<Audio.Sound | undefined>();
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [recordingURI, setRecordingURI] = useState("");
  const [soundAnalysis, setSoundAnalysis] = useState({});
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordedSound, setRecordedSound] = useState<Audio.Sound | undefined>();

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
  }, []);

  async function playSound() {
    console.log("Loading Sound");
    try {
      const { sound: loadedSound, status } = await Audio.Sound.createAsync(
        require("@assets/Hello.mp3") // Ensure the path is correct
      );
      setSound(loadedSound);

      console.log("Playing Sound");
      await loadedSound.playAsync();
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  async function startRecording() {
    try {
      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording: recordedAudio } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recordedAudio);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    setRecordingURI(uri);
    console.log("Recording stopped and stored at", uri);
    const { sound: recordedSound } = await Audio.Sound.createAsync({ uri });
    setRecordedSound(recordedSound);
  }

  async function playRecordedSound() {
    console.log("Playing recorded sound");
    if (recordedSound !== undefined) {
      await recordedSound.playAsync();
    }
  }

  async function analyzeRecordedSound() {
    const apiUrl = "/api/completion";
    let formData = new FormData();

    let blob = await fetch(recordingURI).then((r) => r.blob());

    formData.append("audio_data", blob, "file");

    await fetch(apiUrl, {
      method: "POST",
      // cache: "no-cache",
      body: formData,
    })
      .then((response) => response.json())
      .then((json) => {
        setSoundAnalysis(json);
        return json;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <View className="flex-1 max-w-xl mx-auto dark:bg-black">
      <Text className="lg:text-10xl md:text-5xl text-4xl text-center font-bold p-8 text-gray-700 dark:text-orange-300">
        Audio Playground 🎤
      </Text>
      <TouchableOpacity
       className="p-2 rounded-md items-center justify-center mb-2 bg-orange-400"
       onPress={playSound}
        >
        <Text style={{ color: 'white', fontSize: 16 }}>
          Play Music 
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={{
          backgroundColor: recording ? 'red' : 'green',
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
        onPress={recording ? stopRecording : startRecording}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>
          {recording ? "Stop Recording" : "Start Recording"}
        </Text>
      </TouchableOpacity>

      {/* <Button title="Play Music 🎼" onPress={playSound} /> */}
      {/* <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      /> */}
       <TouchableOpacity
       className={`p-2 rounded-md items-center justify-center mb-2 ${recordedSound === undefined ? 'bg-gray-400' : 'bg-slate-700'}`}
       onPress={playRecordedSound}
       disabled={recordedSound === undefined}
        >
        <Text style={{ color: 'white', fontSize: 16 }}>
          Play Recorded Sound
        </Text>
      </TouchableOpacity>

      {/* <Button
        title="Play Recorded Sound"
       
      />
       */}
      <TouchableOpacity
        className={`p-2 rounded-md items-center justify-center mb-2 ${recordedSound === undefined ? 'bg-gray-400' : 'bg-fuchsia-400'}`}
        onPress={analyzeRecordedSound}
        disabled={recordedSound === undefined}
        >
        <Text style={{ color: 'white', fontSize: 16 }}>
        Analyze Recorded Sound
        </Text>

      </TouchableOpacity>
      {soundAnalysis["reasoning"] && (
        <View className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-4">
          <Text className="text-xl font-bold mb-2">Shadyness: {soundAnalysis["score"]}%</Text>
          <Text className="text-lg">Reasoning: {soundAnalysis["reasoning"]}</Text>
        </View>
      )}

      {/* <Button
        title="Analyze Recorded Sound"
        onPress={analyzeRecordedSound}
        disabled={recordedSound === undefined}
      />
      {soundAnalysis["reasoning"] && (
        <Text>Shadyness: {soundAnalysis["score"]}%</Text>
      )}
      {soundAnalysis["reasoning"] && (
        <Text>Reasoning: {soundAnalysis["reasoning"]}</Text>
      )} */}
    </View>
  );
}
