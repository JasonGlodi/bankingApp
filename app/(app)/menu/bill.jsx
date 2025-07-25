import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Bill = () => {
  const router = useRouter();

  const billTypes = [
    {
      id: 1,
      title: "Electric bill",
      subtitle: "Pay electric bill this month",
      icon: "flash",
      color: "#FFB800",
      screen: "electricBill",
    },
    {
      id: 2,
      title: "Water bill",
      subtitle: "Pay water bill this month",
      icon: "water",
      color: "#2196F3",
      screen: "waterBill",
    },
    {
      id: 3,
      title: "Mobile bill",
      subtitle: "Pay mobile bill this month",
      icon: "phone-portrait",
      color: "#E91E63",
      screen: "mobileBill",
    },
    {
      id: 4,
      title: "Internet bill",
      subtitle: "Pay internet bill this month",
      icon: "wifi",
      color: "#9C27B0",
      screen: "internetBill",
    },
  ];

  const handleBillPress = (screen) => {
    router.push(`/menu/${screen}`);
  };

  const handlePaymentHistory = () => {
    router.push("/menu/paymenthistory");
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pay the bill</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Bill Options */}
      <View style={styles.content}>
        {billTypes.map((bill) => (
          <TouchableOpacity
            key={bill.id}
            style={styles.billCard}
            onPress={() => handleBillPress(bill.screen)}
          >
            <View style={styles.billInfo}>
              <Text style={styles.billTitle}>{bill.title}</Text>
              <Text style={styles.billSubtitle}>{bill.subtitle}</Text>
            </View>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: bill.color + "20" },
              ]}
            >
              <Ionicons name={bill.icon} size={24} color={bill.color} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Payment History Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={handlePaymentHistory}
        >
          <Ionicons name="time-outline" size={20} color="#6C63FF" />
          <Text style={styles.historyButtonText}>Payment History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  billCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  billInfo: {
    flex: 1,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  billSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5FF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6C63FF",
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6C63FF",
    marginLeft: 8,
  },
});

export default Bill;
