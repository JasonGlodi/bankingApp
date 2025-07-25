import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

export default function Language() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://libretranslate.com/languages')
      .then((res) => {
        setLanguages(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch languages:', err);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select App Language</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
            style={Platform.OS === 'ios' ? styles.iosPicker : styles.androidPicker}
          >
            {languages.map((lang) => (
              <Picker.Item key={lang.code} label={lang.name} value={lang.code} />
            ))}
          </Picker>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f1f1f1',
  },
  androidPicker: {
    height: 50,
    width: '100%',
    color: '#000',
  },
  iosPicker: {
    height: 200,
    width: '100%',
  },
});
//npx expo install @react-native-picker/picker
//npm install axios
