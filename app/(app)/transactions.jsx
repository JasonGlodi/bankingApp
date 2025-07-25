import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";

const transactions = [
  {
    id: "1",
    title: "Grocery Store",
    amount: "-XAF 5500.00",
    date: "2025-05-20",
  },
  { id: "2", title: "Salary", amount: "+XAF 1500.00", date: "2025-05-18" },
  {
    id: "3",
    title: "Electricity Bill",
    amount: "-XAF 6000.00",
    date: "2025-05-15",
  },
];

export default function Transactions() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.header}>Transaction History</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text
              style={[
                styles.amount,
                {
                  color: item.amount.startsWith("+") ? "#16A34A" : "#DC2626",
                },
              ]}
            >
              {item.amount}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  date: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
  },
});
