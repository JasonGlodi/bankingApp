import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const MobileBill = () => {
  const navigation = useNavigation();
  const [customerInfo, setCustomerInfo] = useState({
    name: "Junior Justin",
    address: "Logpom",
    phone: "+237 698575700",
    code: "#2143643",
    from: "01/05/2019",
    to: "01/04/2019",
    mobileFee: 2500,
    tax: 0,
    total: 2500,
  });

  const handlePayment = () => {
    Alert.alert(
      "Payment Confirmation",
      `Are you sure you want to pay XAF${customerInfo.total} for your mobile bill?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Pay Now",
          onPress: () => {
            navigation.navigate("PaymentSuccess", {
              billType: "Mobile",
              amount: customerInfo.total,
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mobile payment</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Bill Details */}
      <View style={styles.content}>
        <View style={styles.billCard}>
          <View style={styles.billHeader}>
            <Text style={styles.billTitle}>Mobile Bill</Text>
            <View style={styles.iconContainer}>
              <Ionicons name="phone-portrait" size={24} color="#E91E63" />
            </View>
          </View>

          <View style={styles.billDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>{customerInfo.name}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{customerInfo.address}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone number</Text>
              <Text style={styles.detailValue}>{customerInfo.phone}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Code</Text>
              <Text style={styles.detailValue}>{customerInfo.code}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>From</Text>
              <Text style={styles.detailValue}>{customerInfo.from}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>To</Text>
              <Text style={styles.detailValue}>{customerInfo.to}</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mobile fee</Text>
              <Text style={styles.feeValue}>XAF{customerInfo.mobileFee}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tax</Text>
              <Text style={styles.feeValue}>XAF{customerInfo.tax}</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.detailRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>XAF{customerInfo.total}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Pay Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay the bill</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  billHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  billTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E91E6320",
    alignItems: "center",
    justifyContent: "center",
  },
  billDetails: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  feeValue: {
    fontSize: 14,
    color: "#6C63FF",
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF4757",
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    backgroundColor: "#FFFFFF",
  },
  payButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default MobileBill;
