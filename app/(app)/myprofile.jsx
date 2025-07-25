import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Avatar } from 'react-native-paper';

export default function MyProfile() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      <View style={styles.profileSection}>
        <Avatar.Image 
          size={90} 
          source={{ uri: 'https://i.pravatar.cc/300' }} 
        />
        <Text style={styles.name}>Yvanna Noee</Text>
        <Text style={styles.email}>yvannangong13@gmail.com</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>+237 699 288 228</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>123 Bank Street, Douala, Cameroon</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Account Type</Text>
        <Text style={styles.value}>Savings Account</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Member Since</Text>
        <Text style={styles.value}>January 2025</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#f4f6f8',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
    alignSelf: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
