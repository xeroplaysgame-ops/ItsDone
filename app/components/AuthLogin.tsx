import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FloatingInput from './FloatingInput';
import { useAuth } from '../../hooks/useAuth';

const AuthLogin: React.FC<{ onSwitchView?: () => void }> = ({ onSwitchView }) => {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (e) {
      alert('Sign in failed: ' + (e as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <FloatingInput placeholder="Email" value={email} onChange={setEmail} />
      <FloatingInput placeholder="Password" secure value={password} onChange={setPassword} />

      <TouchableOpacity style={[styles.btn, loading && { opacity: 0.7 }]} onPress={handle} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Signing in...' : 'Continue'}</Text>
      </TouchableOpacity>

      <View style={styles.socialRow}>
        <TouchableOpacity
          style={styles.social}
          onPress={async () => {
            try {
              await signInWithGoogle();
            } catch (e: any) {
              // Show a helpful message if Google sign-in isn't configured in Firebase
              const code = e?.code || 'unknown';
              const msg = e?.message || String(e);
              alert(
                'Google sign-in failed (' + code + '): ' + msg + "\n\nMake sure Google provider is enabled in Firebase, and add 'localhost' / '127.0.0.1' and your firebaseapp domain to the project's authorized domains."
              );
              console.error('Google sign-in error', e);
            }
          }}
        >
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.social} onPress={() => alert('Apple sign-in not configured')}>
          <Text style={styles.socialText}> Apple</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: { height: 52, backgroundColor: '#007AFF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  socialRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  social: { flex: 1, borderWidth: 1, borderColor: '#2b2b2b', borderRadius: 10, padding: 12, marginHorizontal: 6, alignItems: 'center' },
  socialText: { color: '#fff', fontWeight: '600' },
});

export default AuthLogin;
