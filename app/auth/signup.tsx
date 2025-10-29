import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import LoginScreen from './login';

// For signup we reuse the visual language of Login but keep a compact form here.
const SIGNUP_PRIMARY = '#007AFF';

const SignupScreen: React.FC = () => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      await signUp(email, password);
      alert('Account created — you should be logged in.');
    } catch (e) {
      alert('Sign up failed: ' + (e as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      {/* keep inputs compact but styled similarly to login; reuse Login's FloatingInput would be ideal but keep simple here */}
      <View style={{ marginBottom: 12 }}>
        <Text style={styles.labelSmall}>Email</Text>
        <TextInputShim value={email} onChange={setEmail} placeholder="you@company.com" />
      </View>
      <View style={{ marginBottom: 12 }}>
        <Text style={styles.labelSmall}>Password</Text>
        <TextInputShim value={password} onChange={setPassword} secure />
      </View>

      <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleSignup} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create account'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const TextInputShim: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string; secure?: boolean }> = ({ value, onChange, placeholder, secure }) => (
  <View style={shimStyles.wrapper}>
    <TextInputInner value={value} onChange={onChange} secure={secure} placeholder={placeholder} />
    <View style={shimStyles.underline} />
  </View>
);

const TextInputInner: React.FC<any> = ({ value, onChange, secure, placeholder }) => (
  <TextInput value={value} onChangeText={onChange} secureTextEntry={secure} placeholder={placeholder} style={shimStyles.input} autoCapitalize="none" />
);

const shimStyles = StyleSheet.create({
  wrapper: { marginBottom: 8 },
  input: { height: 40, fontSize: 15, color: '#fff' },
  underline: { height: 1, backgroundColor: '#333' },
});

const styles = StyleSheet.create({
  container: { padding: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 8 },
  labelSmall: { color: '#9aa0a6', marginBottom: 6 },
  button: { height: 48, backgroundColor: SIGNUP_PRIMARY, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});

export default SignupScreen;
