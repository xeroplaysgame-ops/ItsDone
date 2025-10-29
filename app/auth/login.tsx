import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';

const PRIMARY = '#007AFF';

const FloatingInput: React.FC<{
  placeholder: string;
  value: string;
  secure?: boolean;
  onChange: (v: string) => void;
}> = ({ placeholder, value, secure, onChange }) => {
  const focused = useRef(new Animated.Value(value ? 1 : 0)).current;

  const onFocus = () => Animated.timing(focused, { toValue: 1, duration: 180, useNativeDriver: true }).start();
  const onBlur = () => {
    if (!value) Animated.timing(focused, { toValue: 0, duration: 180, useNativeDriver: true }).start();
  };

  const labelStyle = {
    transform: [
      {
        translateY: focused.interpolate({ inputRange: [0, 1], outputRange: [12, -10] }),
      },
    ],
    fontSize: focused.interpolate({ inputRange: [0, 1], outputRange: [16, 12] }) as any,
    color: focused.interpolate({ inputRange: [0, 1], outputRange: ['#9aa0a6', PRIMARY] }) as any,
    fontFamily: Platform.OS === 'web' ? 'Inter_400Regular' : undefined,
  };

  return (
    <View style={fStyles.wrapper}>
      <Animated.Text style={[fStyles.label, labelStyle]}>{placeholder}</Animated.Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        secureTextEntry={secure}
        style={fStyles.input}
        autoCapitalize="none"
      />
      <View style={fStyles.underline} />
    </View>
  );
};

const LoginScreen: React.FC = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (e) {
      alert('Login failed: ' + (e as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Let's get it done.</Text>
        <Text style={styles.subtitle}>Sign in to sync your tasks across all devices.</Text>
      </View>

      <View style={styles.form}>
        <FloatingInput placeholder="Email" value={email} onChange={setEmail} />
        <FloatingInput placeholder="Password" value={password} onChange={setPassword} secure />

        <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Continue'}</Text>
        </TouchableOpacity>

        <Text style={styles.or}>Or sign in with</Text>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton} onPress={() => alert('Google Sign-In not configured')}>
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => alert('Apple Sign-In not configured')}>
            <Text style={styles.socialText}> Apple</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const fStyles = StyleSheet.create({
  wrapper: { marginBottom: 20, position: 'relative' },
  label: { position: 'absolute', left: 0 },
  input: { height: 44, fontSize: 16, paddingVertical: 6, color: '#fff', paddingLeft: 0 },
  underline: { height: 1, backgroundColor: '#333', marginTop: 6 },
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 8 },
  subtitle: { color: '#9aa0a6' },
  form: { paddingRight: 24 },
  button: { height: 52, backgroundColor: PRIMARY, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  or: { textAlign: 'center', marginVertical: 12, color: '#9aa0a6' },
  socialRow: { flexDirection: 'row', justifyContent: 'space-between' },
  socialButton: { flex: 1, borderWidth: 1, borderColor: '#2b2b2b', borderRadius: 10, padding: 12, marginHorizontal: 6, alignItems: 'center' },
  socialText: { color: '#fff', fontWeight: '600' },
});

export default LoginScreen;
