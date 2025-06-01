import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const transactions = [
  { id: '1', title: 'Grocery Store', amount: '-$45.00', date: '2025-05-20' },
  { id: '2', title: 'Salary', amount: '+$1500.00', date: '2025-05-18' },
  { id: '3', title: 'Electricity Bill', amount: '-$60.00', date: '2025-05-15' },
];

export default function Transactions() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={[styles.amount, { color: item.amount.startsWith('+') ? 'green' : 'red' }]}>
              {item.amount}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: '500' },
  date: { fontSize: 14, color: '#888' },
  amount: { fontSize: 16, fontWeight: 'bold' },
});
