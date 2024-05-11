import React from 'react';
import {StyleSheet, Alert, FlatList, ActivityIndicator} from 'react-native';
import {Colors,Badge, View, ListItem, Text } from 'react-native-ui-lib';
import { supabase } from '@/frontend/lib/supabase';
import { formatDateTime } from '@/utils/datetime';
import { useQuery } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import { globalStyles } from '../../theme';

type CallData = {
  call_id: number;
  call_start_datetime: string;
  transcription: string;
  score: number;
  category: string;
}

export default function Page () {  
  const {data, isLoading, error } = useQuery<CallData[]>({
    queryKey: ['calls'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("v_calls_with_analyses")
        .select("call_id, call_start_datetime, transcription,score,category")
        .not("score", "is", null)
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
  return (
    <View style={globalStyles.container}>
      <Stack.Screen options={{title: 'Calls', headerShown: false, headerBackTitleVisible: false}} />
      <Text text30BO center>Call Data</Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        
        <FlatList
            data={data}
            keyExtractor={({ call_id }) => call_id.toString()}
            renderItem={({ item }) => (
              <ListItem activeBackgroundColor={Colors.grey60}
                        activeOpacity={0.3}
                        height={77.5}
                        onPress={() => router.push(`/calls/${item.call_id}`)} 
                        style={styles.border}
                        >
                  <ListItem.Part  >
                    <Badge 
                      label={item.score.toString()} 
                      size={20}
                      backgroundColor={item.score > 80 ? 'red' : 'green'}
                    />
                  </ListItem.Part>
                  <ListItem.Part >
                      <Badge label={item.category} backgroundColor='blue' size={20}/>
                  </ListItem.Part>
                  <ListItem.Part >
                      <Text  grey10 text100 > {formatDateTime(item.call_start_datetime)}</Text>
                  </ListItem.Part>
              </ListItem>
            )} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey50
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: Colors.grey70,
    paddingVertical: 10,
    marginHorizontal: 5
  }
});
