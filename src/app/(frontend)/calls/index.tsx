import React, {Component, useEffect, useState} from 'react';
import {StyleSheet, Alert, FlatList, ActivityIndicator} from 'react-native';
import {Colors, BorderRadiuses, View, Image, ListItem, Text } from 'react-native-ui-lib';
import orders, {OrderType} from '@assets/orders';
import { supabase } from '@/frontend/lib/supabase';


type CallData = {
  call_id: number;
  call_start_datetime: string;
  transcription: string;
  score: number;
  category: string;
}

export default function App () {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<CallData[]>([]);

  const getMovies = async () => {
    try {
      const { data, error } = await supabase
        .from("v_calls_with_analyses")
        .select("call_id, call_start_datetime, transcription,score,category")
        .not("score", "is", null)
      
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <View style={{flex: 1, padding: 24}}>
      <Text text30BO center>Call Data</Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        
        <FlatList
            data={data}
            keyExtractor={({ call_id }) => call_id.toString()}
            renderItem={({ item }) => (
              <Text>
                {item.call_id}, {item.category}
              </Text>
            )} />
      )}
    </View>
  );
};


// export default class BasicListScreen extends Component {

//   keyExtractor = (item: OrderType) => item.name;

//   renderRow(row: OrderType, id: number) {
//     const statusColor = row.inventory.status === 'Paid' ? Colors.green30 : Colors.red30;

//     return (
//       <View>
//         <ListItem
//           activeBackgroundColor={Colors.grey60}
//           activeOpacity={0.3}
//           height={77.5}
//           onPress={() => Alert.alert(`pressed on order #${id + 1}`)}
//         >
//           <ListItem.Part left>
//             <Image source={{uri: row.mediaUrl}} style={styles.image}/>
//           </ListItem.Part>
//           <ListItem.Part middle column containerStyle={[styles.border, {paddingRight: 17}]}>
//             <ListItem.Part containerStyle={{marginBottom: 3}}>
//               <Text grey10 text70 style={{flex: 1, marginRight: 10}} numberOfLines={1}>
//                 {row.name}
//               </Text>
//               <Text grey10 text70 style={{marginTop: 2}}>
//                 {row.formattedPrice}
//               </Text>
//             </ListItem.Part>
//             <ListItem.Part>
//               <Text
//                 style={{flex: 1, marginRight: 10}}
//                 text90
//                 grey40
//                 numberOfLines={1}
//               >{`${row.inventory.quantity} item`}</Text>
//               <Text text90 color={statusColor} numberOfLines={1}>
//                 {row.inventory.status}
//               </Text>
//             </ListItem.Part>
//           </ListItem.Part>
//         </ListItem>
//       </View>
//     );
//   }

//   render() {
//     return (
      
//       <FlatList
//         data={orders}
//         renderItem={({item, index}) => this.renderRow(item, index)}
//         keyExtractor={this.keyExtractor}
//       />
//     );
//   }
// }

// const styles = StyleSheet.create({
//   image: {
//     width: 54,
//     height: 54,
//     borderRadius: BorderRadiuses.br20,
//     marginHorizontal: 14
//   },
//   border: {
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderColor: Colors.grey70
//   }
// });