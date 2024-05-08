import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet , TouchableOpacity} from "react-native";
import { getCallOverview } from '@/backend/data/callRepository';
export default function Page() {
  const [callDetails, setCallDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const callId = 32
  // this code now produces an error with missing OPENAI_API_KEY
  // I think it may be related to: 
//   The following packages should be updated for best compatibility with the installed expo version:
//   expo@50.0.14 - expected version: ~50.0.17
//   expo-av@13.10.5 - expected version: ~13.10.6
//   expo-constants@15.4.5 - expected version: ~15.4.6
//   expo-router@3.4.8 - expected version: ~3.4.10
//   expo-splash-screen@0.26.4 - expected version: ~0.26.5
// Your project may not work correctly until you install the correct versions of the packages.

//   useEffect(() => {
//     async function fetchCallDetails() {
//         try {
//             const data = await getCallOverview(callId);
//             setCallDetails(data);
//             setError(null);
//         } catch (err) {
//             setError((err as Error).message);
//             setCallDetails(null);
//         } finally {
//             setLoading(false);
//         }
//     }

//     if (!isNaN(callId)) {
//         fetchCallDetails();
//     } else {
//         setError('Invalid Call ID');
//         setLoading(false);
//     }
// }, [callId]);
  return <Text className='h-7'>Home page </Text>;
}