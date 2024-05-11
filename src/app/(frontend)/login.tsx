import React, { useState } from 'react'

import Auth from "@/frontend/components/Auth";
import { Stack } from "expo-router";
import { TouchableOpacity, View, Text } from "react-native";
import {Button} from 'react-native-ui-lib'
import { globalStyles } from './theme';



export default function Login() {
    const [showLogin, setShowLogin] = useState(true);

    const handleLogin = () => {
        setShowLogin(true);
    };

    return (
        <View style={globalStyles.container}>
            {/* {!showLogin && (
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                >
                    <Text style={styles.loginButtonText}>Click anywhere to login</Text>
                </TouchableOpacity>
            )}
 */}
            {/* {showLogin && (
                <> */}
                    <Stack.Screen
                        options={{
                            title: 'Log In',
                            headerShown: showLogin,
                            headerBackTitleVisible: false,
                        }}
                    />
                    <Auth />
                {/* </>
            )} */}
        </View>
    );
}