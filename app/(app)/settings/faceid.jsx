import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FaceID() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const loadPreference = async () => {
      const saved = await AsyncStorage.getItem('faceIDEnabled');
      if (saved !== null) setIsEnabled(saved === 'true');
    };
    loadPreference();
  }, []);

  const toggleSwitch = async () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    await AsyncStorage.setItem('faceIDEnabled', newValue.toString());
    Alert.alert("Success", `Face ID has been ${newValue ? 'enabled' : 'disabled'}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Face ID</Text>
      <View style={styles.setting}>
        <Text style={styles.label}>Enable Face ID for Login</Text>
        <Switch value={isEnabled} onValueChange={toggleSwitch} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  setting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 16 },
});
//npm install @react-native-async-storage/async-storage
//npx pod-install
