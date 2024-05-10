import { supabase } from "@/frontend/lib/supabase";
import { formatDateTime } from "@/utils/datetime";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native";
import {Badge, View, Card, CardProps, Button, Text} from 'react-native-ui-lib';

export default function Page() {
  const {call_id} = useLocalSearchParams()
  const {data, isLoading, error } = useQuery({
    queryKey: ['callDetails'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("v_calls_with_analyses")
        .select("call_id, call_start_datetime, transcription,score,category")
        .eq("call_id", call_id)
        .single()
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
  if (isLoading) {
    return <ActivityIndicator />
  }
  return (
    // <Text>Home page {call_id}</Text>
    <View row marginV-10 marginH-20 >
      <Card flex center >
         <Card.Section
          content={[{text: `Call - ${call_id}`, text30: true, grey10: true}]}
          contentStyle={{alignItems: 'center'}}
          />
        <Card.Section
          content={[{text: `${formatDateTime(data.call_start_datetime)}`, text70: true, grey10: true}]}
          // contentStyle={{alignItems: 'flex-start'}}
          />
         <Badge 
            label={data.score.toString()} 
            size={20}
            backgroundColor={data.score > 80 ? 'red' : 'green'}
          />
        <Badge label={data.category} backgroundColor='blue' size={20}/>
                
        <Card.Section
        content={[{text: data.transcription, text100L: true, grey10: true}]}
        // contentStyle={{alignItems: 'flex-start'}}
        />
      </Card>
      
    </View>
    )
  }