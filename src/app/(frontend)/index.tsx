import { Link, Stack, router } from "expo-router";
import React from "react";
import { Text, View , TouchableOpacity, Button} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from 'expo-image';
import { Asset } from 'expo-asset';

const image = Asset.fromModule(require('@assets/landing-image.webp')).uri;

export default function Page() {
  return (
    <View className="flex bg-white dark:bg-black">
      <Stack.Screen options={{headerShown: false}} />
      <Header />
      <Content />
      <Footer />
    </View>
  );
}

function Content() {
  return (
    <View className="">
      <View className="">
        <View className="px-4 md:px-3">
          <View className="flex flex-col items-center gap-2 text-center">
            <Text
              role="heading"
              className="text-3xl text-center native:text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-black dark:text-white"
            >
              Welcome to Guardian AI
            </Text>
            <Image
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              source={{ uri: image }}
              style={{ width: 300, height: 200 }}
            />
            <Text className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 top-6 m-3 text-justify" >
              Protecting the Elderly from Spam Calls using AI-powered call monitoring and protection.
              Real-time analysis. Automatic call blocking. Personalized settings.

            </Text>
            <Text className="mx-auto max-w-[700px] text-lg text-center text-gray-500 md:text-xl dark:text-gray-400" style={{textAlign: 'left'}}>
            </Text>

            <View className="flex-row  gap-4">
                <TouchableOpacity onPress={() => router.navigate("/auth")} className="flex justify-center items-center rounded-md bg-blue-600 text-white h-9 w-20">
                    <Text className="text-white">
                      Sign In
                    </Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function Header() {
  const { top } = useSafeAreaInsets();
  return (
    <View >
      <View className="px-4 lg:px-6 h-14 flex items-center flex-row justify-between ">
        <Link className="font-bold flex-1 items-center justify-center text-black dark:text-white" href="/">
          Guardian
        </Link>
        <View className="flex flex-row gap-4 sm:gap-6">
          <Link
            className="text-md font-medium hover:underline web:underline-offset-4 text-black dark:text-white"
            href="/"
          >
            About
          </Link>
          <Link
            className="text-md font-medium hover:underline web:underline-offset-4 text-black dark:text-white"
            href="/"
          >
            Product
          </Link>
          <Link
            className="text-md font-medium hover:underline web:underline-offset-4 text-black dark:text-white"
            href="/"
          >
            Pricing
          </Link>
        </View>
      </View>
    </View>
  );
}

function Footer() {
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      className="flex shrink-0 bg-gray-100 native:hidden"
      style={{ paddingBottom: bottom }}
    >
      <View className="py-6 flex-1 items-start px-4 md:px-6 ">
        <Text className={"text-center text-gray-700"}>
          © {new Date().getFullYear()} Me
        </Text>
      </View>
    </View>
  );
}
