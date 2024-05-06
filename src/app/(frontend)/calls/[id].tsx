import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getCallOverview } from '@/backend/data/callRepository'; // Adjust path accordingly

export default function CallDetails() {
    const [callDetails, setCallDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Retrieve callId using useLocalSearchParams
    const { id: idString } = useLocalSearchParams();
    const callId = Number(idString);

    useEffect(() => {
        async function fetchCallDetails() {
            try {
                const data = await getCallOverview(callId);
                setCallDetails(data);
                setError(null);
            } catch (err) {
                setError((err as Error).message);
                setCallDetails(null);
            } finally {
                setLoading(false);
            }
        }

        if (!isNaN(callId)) {
            fetchCallDetails();
        } else {
            setError('Invalid Call ID');
            setLoading(false);
        }
    }, [callId]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Call Details</Text>
            {callDetails ? (
                <View>
                    {/* Score */}
                    <Text style={styles.label}>Score:</Text>
                    <Text style={styles.value}>{callDetails.score}</Text>

                    {/* Category and Sub-Category */}
                    <Text style={styles.label}>Category and Sub-Category:</Text>
                    <View style={styles.tagContainer}>
                        <Text style={styles.tag}>{callDetails.category}</Text>
                        <Text style={styles.tag}>{callDetails.sub_category}</Text>
                    </View>

                    {/* Transcription */}
                    <Text style={styles.label}>Transcription:</Text>
                    <TextInput
                        style={styles.textBox}
                        value={callDetails.transcription}
                        multiline
                        editable={false}
                    />

                    {/* Reasoning */}
                    <Text style={styles.label}>Reasoning:</Text>
                    <Text style={styles.value}>{callDetails.reasoning}</Text>
                </View>
            ) : (
                <Text>No details available</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
    },
    value: {
        fontSize: 16,
        marginBottom: 8,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 8,
    },
    tag: {
        backgroundColor: '#007AFF',
        color: '#fff',
        padding: 8,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    textBox: {
        width: '100%',
        minHeight: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
    },
});
