import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';

import { TaskProvider } from './context/TaskContext';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import AddTaskModal from './components/AddTaskModal';
import TaskListScreen from './screens/TaskListScreen';
import AuthScreen from './auth';

// Request/handle notifications — simple wrapper
// Return full NotificationBehavior shape to satisfy TypeScript across SDK versions
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    // Newer SDKs include banner/list flags — set them for compatibility
    // @ts-ignore: some SDK versions don't declare these fields in types, but runtime accepts them
    shouldShowBanner: true,
    // @ts-ignore
    shouldShowList: true,
  }),
});

const prefix = Linking.createURL('/');

const AppShell: React.FC = () => {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  const { user, loading } = useAuth();
  const scheme = useColorScheme();

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') await Notifications.requestPermissionsAsync();
    })();

    // handle deep linking for widget actions: itsdone://completeTask/TASK_ID
    const subscription = Linking.addEventListener('url', ({ url }) => {
      // parse and handle in TaskProvider or navigate accordingly
      // Example: itsdone://completeTask/12345 -> we could call a handler to toggle complete
      console.log('Deep link received', url);
    });
    return () => subscription.remove();
  }, []);

  if (!fontsLoaded || loading) return null;

  return (
    <SafeAreaView style={[styles.container, scheme === 'dark' ? styles.dark : styles.light]}>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
      {user ? (
        <TaskProvider>
          <TaskListScreen />
        </TaskProvider>
      ) : (
        // single auth container that toggles between Login and Sign Up
        <View style={{ flex: 1 }}>
          <AuthScreen />
        </View>
      )}
    </SafeAreaView>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  light: { backgroundColor: '#f5f5f5' },
  dark: { backgroundColor: '#0b1220' },
});

export default App;

