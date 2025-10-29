import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FloatingInput from './FloatingInput';
import { useAuth } from '../../hooks/useAuth';

const AuthSignUp: React.FC<{ onSwitchView?: () => void }> = ({ onSwitchView }) => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async () => {
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
    <View>
      <FloatingInput placeholder="Email" value={email} onChange={setEmail} />
      <FloatingInput placeholder="Password" secure value={password} onChange={setPassword} />

      <TouchableOpacity style={[styles.btn, loading && { opacity: 0.7 }]} onPress={handle} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Creating...' : 'Create account'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: { height: 52, backgroundColor: '#007AFF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

export default AuthSignUp;
