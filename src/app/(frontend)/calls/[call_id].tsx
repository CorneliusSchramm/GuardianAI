import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Badge, View, Card, Text } from 'react-native-ui-lib';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import { formatDateTime } from "@/utils/datetime";
import { useLocalSearchParams } from "expo-router";

export default function Page() {
  const { call_id } = useLocalSearchParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['callDetails'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("v_calls_with_analyses")
        .select("call_id, call_start_datetime, transcription, score, category, sub_category, reasoning")
        .eq("call_id", call_id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title} text30 grey10>{`Call - ${call_id}`}</Text>
        <Text style={styles.date} text70 grey10>{formatDateTime(data.call_start_datetime)}</Text>
        <View style={styles.badgeContainer}>
        
          <Badge 
            label={data.score.toString()} 
            size={25}
            backgroundColor={data.score > 80 ? 'red' : 'green'}
            containerStyle={styles.scoreBadge}
          />
          <Badge
            label={data.category}
            backgroundColor='blue'
            size={25}
            // containerStyle={styles.categoryBadge}
          />
        </View>
        <Text style={styles.transcription} text90BO grey10>{data.reasoning}</Text>
        <Text style={styles.transcription} text100L grey10>{data.transcription}</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    // justifyContent: 'top',
  },
  card: {
    padding: 20,
    borderRadius: 8,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
  },
  title: {
    marginBottom: 8,
  },
  date: {
    marginBottom: 16,
    color: '#888',
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  scoreBadge: {
    marginRight: 10,
  },
  categoryBadge: {
    backgroundColor: '#007aff',
  },
  transcription: {
    color: '#444',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
});
