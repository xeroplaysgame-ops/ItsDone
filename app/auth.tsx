import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AuthLogin from './components/AuthLogin';
import AuthSignUp from './components/AuthSignUp';

const AuthContainer: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Let's get it done.</Text>
        <Text style={styles.subtitle}>Sign in to sync your tasks across all devices.</Text>
      </View>

      {isLoginView ? (
        <AuthLogin onSwitchView={() => setIsLoginView(false)} />
      ) : (
        <AuthSignUp onSwitchView={() => setIsLoginView(true)} />
      )}

      <View style={styles.switchRow}>
        <Text style={styles.switchText}>{isLoginView ? "Don't have an account?" : 'Already have an account?'}</Text>
        <TouchableOpacity onPress={() => setIsLoginView((s) => !s)}>
          <Text style={styles.switchLink}>{isLoginView ? ' Sign up' : ' Sign in'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 28 },
  title: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 6 },
  subtitle: { color: '#9aa0a6' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  switchText: { color: '#9aa0a6' },
  switchLink: { color: '#007AFF', fontWeight: '700' },
});

export default AuthContainer;
