import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function Page() {
  return (
    <View className="flex flex-1 bg-white dark:bg-black">
      <Content />
    </View>
  );
}

function Content() {
  return (
    <View className="flex-1 justify">
          <View className="flex flex-col items-center gap-2 pt-10">
            <Text
              role="heading"
              className="text-3xl text-center native:text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-5xl p-7 text-black dark:text-white"
            >
              Record Audio Here 🎤
            </Text>
            <View>
              <Text className="text-white bg-green-200">
                Test
              </Text>
            </View>
          </View>
    </View>
  );
}
