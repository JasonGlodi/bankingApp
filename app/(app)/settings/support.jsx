import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';

export default function Support() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Help & Support</Text>
      
      <Text style={styles.subHeader}>
        We're here to assist you. Choose a support option:
      </Text>

      <TouchableOpacity style={styles.item}>
        <Avatar.Icon icon="email" size={36} />
        <Text style={styles.itemText}>Email Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Avatar.Icon icon="phone" size={36} />
        <Text style={styles.itemText}>Call Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Avatar.Icon icon="chat" size={36} />
        <Text style={styles.itemText}>Live Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Avatar.Icon icon="help" size={36} />
        <Text style={styles.itemText}>FAQs</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  subHeader: { fontSize: 16, color: '#555', marginBottom: 20 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  itemText: { marginLeft: 15, fontSize: 16, fontWeight: '500' },
});
