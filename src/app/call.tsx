import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet , TouchableOpacity} from "react-native";

export default function Page() {
    const [count, setCount] = useState(0);
    return (
      <View className= "border justify-center items-center">
        <Text className='text-4xl font-bold text-center p-4 '>Hello</Text>
        <TouchableOpacity 
            className='bg-slate-400 rounded-md w-1/2 '
            onPress={() => setCount(count + 1)}
        >
        <Text className="text-center text-xl font-semibold text-white">
          Add Count 
        </Text>
      </TouchableOpacity>
        <Text>{count}</Text>
      </View>
    );
  }