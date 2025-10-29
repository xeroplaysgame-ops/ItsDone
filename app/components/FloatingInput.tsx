import React, { useRef } from 'react';
import { View, Animated, TextInput, Platform, StyleSheet, Text } from 'react-native';

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
    color: focused.interpolate({ inputRange: [0, 1], outputRange: ['#9aa0a6', '#007AFF'] }) as any,
    fontFamily: Platform.OS === 'web' ? 'Inter_400Regular' : undefined,
  };

  return (
    <View style={styles.wrapper}>
      <Animated.Text style={[styles.label, labelStyle]}>{placeholder}</Animated.Text>
      <TextInput value={value} onChangeText={onChange} onFocus={onFocus} onBlur={onBlur} secureTextEntry={secure} style={styles.input} autoCapitalize="none" />
      <View style={styles.underline} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 20, position: 'relative' },
  label: { position: 'absolute', left: 0 },
  input: { height: 44, fontSize: 16, paddingVertical: 6, color: '#fff', paddingLeft: 0 },
  underline: { height: 1, backgroundColor: '#333', marginTop: 6 },
});

export default FloatingInput;
