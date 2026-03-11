/**
 * @format
 */

// Must be the very first import to fix Supabase Realtime on Android/React Native
// Fixes: "Cannot assign to property 'protocol' which has only a getter"
import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
