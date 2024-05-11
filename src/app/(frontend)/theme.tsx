import { Colors, ThemeManager } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        // flex: 1,
        justifyContent: 'center',
        padding: 20,

        // alignItems: 'center',
        backgroundColor: Colors.$backgroundDefault,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
});

ThemeManager.setComponentTheme('Button', {
    size: 'large',
    backgroundColor: Colors.$primary,
});