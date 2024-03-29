import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet , TouchableOpacity} from "react-native";

export default function Page() {
    const [count, setCount] = useState(0);
    type Call = {
        uri: string;
        id: string;
        status: {
            callStatus: string;
            callerStatus: string;
            calleeStatus: string;
        };
    };

    const [call, setCall] = useState<Call | null>(null);

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
            setCall(json);
        })
        .catch(error => {
            console.error(error);
        });
    }
    async function findCall() {
        console.log("Call: ", call);
        if (!call || !call.id) {
            return;
        }
        const sessionId = call.id;
        const apiUrl = `/api/telephony/${sessionId}`;
            
        const r = await fetch(apiUrl, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        console.log("Call Details: ", r);
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
      <Text>Call Details: {call?.status?.callStatus}</Text>
      {/* <Text>Call Details: {call?.status?.callStatus}</Text> */}
      <TouchableOpacity 
            className='bg-blue-500 rounded-md w-1/2 m-4'
            onPress={() => findCall()}
        >
        <Text className="text-center text-xl font-semibold text-white">
          Call details
        </Text>
      </TouchableOpacity>
      </View>
    );
  }