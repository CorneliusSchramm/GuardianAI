import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet , TouchableOpacity} from "react-native";

export default function Page() {
    const [count, setCount] = useState(0);
    const [call, setCall] = useState("");

    async function triggerCall() {
        const apiUrl = "/api/call";
            
        await fetch(apiUrl, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(json => {
            setCall(json.message);
        })
        .catch(error => {
            console.error(error);
        });
    }

    return (
      <View className= "border justify-center items-center">
        <Text className='text-4xl font-bold text-center p-4'>Hello</Text>
        <TouchableOpacity 
            className='bg-slate-400 rounded-md w-1/2'
            onPress={() => setCount(count + 1)}
        >
        <Text className="text-center text-xl font-semibold text-white">
          Add Count 
        </Text>
      </TouchableOpacity>
        <Text>{count}</Text>
        <TouchableOpacity 
            className='bg-green-700 rounded-md w-1/2 m-4'
            onPress={() => triggerCall()}
        >
        <Text className="text-center text-xl font-semibold text-white">
          Trigger call
        </Text>
      </TouchableOpacity>
      <Text>Call Details: {call}</Text>
      </View>
    );
  }