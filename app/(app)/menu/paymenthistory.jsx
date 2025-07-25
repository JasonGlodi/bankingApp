import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Header from "../../components/header";
import Navbar from "../../components/Navbar";

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("Electric");

  const handleBackPress = () => {
    router.push("/menu/bill");
  };

  const tabs = ["Electric", "Water", "Mobile", "Internet"];

  // Sample payment data for different bill types
  const paymentData = {
    Electric: [
      {
        id: "1",
        month: "October",
        date: "30/10/2024",
        status: "Unsuccessfully",
        amount: "XAF480",
        company: "ENEO",
      },
      {
        id: "2",
        month: "September",
        date: "30/09/2024",
        status: "Successfully",
        amount: "XAF480",
        company: "ENEO",
      },
      {
        id: "3",
        month: "August",
        date: "30/08/2024",
        status: "Successfully",
        amount: "XAF480",
        company: "ENEO",
      },
      {
        id: "4",
        month: "July",
        date: "30/07/2024",
        status: "Successfully",
        amount: "XAF2950",
        company: "ENEO",
      },
      {
        id: "5",
        month: "June",
        date: "30/06/2024",
        status: "Successfully",
        amount: "XAF35000",
        company: "ENEO",
      },
      {
        id: "6",
        month: "May",
        date: "30/05/2024",
        status: "Successfully",
        amount: "XAF4800",
        company: "ENEO",
      },
    ],
    Water: [
      {
        id: "7",
        month: "October",
        date: "30/10/2024",
        status: "Unsuccessfully",
        amount: "XAF120",
        company: "Cam Water",
      },
      {
        id: "8",
        month: "September",
        date: "30/09/2024",
        status: "Successfully",
        amount: "XAF120",
        company: "Cam Water",
      },
      {
        id: "9",
        month: "August",
        date: "30/08/2024",
        status: "Successfully",
        amount: "XAF1000",
        company: "Cam Water",
      },
      {
        id: "10",
        month: "July",
        date: "30/07/2024",
        status: "Successfully",
        amount: "XAF500",
        company: "Cam Water",
      },
      {
        id: "11",
        month: "June",
        date: "30/06/2024",
        status: "Successfully",
        amount: "XAF120",
        company: "Cam Water",
      },
    ],
    Mobile: [
      {
        id: "12",
        month: "October",
        date: "30/10/2024",
        status: "Successfully",
        amount: "XAF25000",
        company: "iPhone Cameroon",
      },
      {
        id: "13",
        month: "September",
        date: "30/09/2024",
        status: "Successfully",
        amount: "XAF25000",
        company: "iPhone Cameroon",
      },
      {
        id: "14",
        month: "August",
        date: "30/08/2024",
        status: "Successfully",
        amount: "XAF25000",
        company: "iPhone Cameroon",
      },
      {
        id: "15",
        month: "July",
        date: "30/07/2024",
        status: "Successfully",
        amount: "XAF25000",
        company: "iPhone Cameroon",
      },
      {
        id: "16",
        month: "June",
        date: "30/06/2024",
        status: "Successfully",
        amount: "XAF25000",
        company: "iPhone Cameroon",
      },
    ],
    Internet: [
      {
        id: "17",
        month: "October",
        date: "30/10/2024",
        status: "Unsuccessfully",
        amount: "XAF1000",
        company: "Internet Provider",
      },
      {
        id: "18",
        month: "September",
        date: "30/09/2024",
        status: "Successfully",
        amount: "XAF3000",
        company: "Internet Provider",
      },
      {
        id: "19",
        month: "August",
        date: "30/08/2024",
        status: "Successfully",
        amount: "XAF2000",
        company: "Internet Provider",
      },
      {
        id: "20",
        month: "July",
        date: "30/07/2024",
        status: "Successfully",
        amount: "XAF1500",
        company: "Internet Provider",
      },
      {
        id: "21",
        month: "June",
        date: "30/06/2024",
        status: "Successfully",
        amount: "XAF2000",
        company: "Internet Provider",
      },
    ],
  };

  const renderTabButton = (tab) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabButton, selectedTab === tab && styles.activeTabButton]}
      onPress={() => setSelectedTab(tab)}
    >
      <Text
        style={[styles.tabText, selectedTab === tab && styles.activeTabText]}
      >
        {tab}
      </Text>
    </TouchableOpacity>
  );

  const renderPaymentItem = ({ item }) => (
    <View style={styles.paymentItem}>
      <View style={styles.paymentHeader}>
        <Text style={styles.monthText}>{item.month}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>

      <View style={styles.paymentDetails}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status</Text>
          <Text
            style={[
              styles.statusValue,
              item.status === "Successfully"
                ? styles.successStatus
                : styles.errorStatus,
            ]}
          >
            {item.status}
          </Text>
        </View>

        {item.company && (
          <View style={styles.companyRow}>
            <Text style={styles.companyLabel}>Company</Text>
            <Text style={styles.companyValue}>{item.company}</Text>
          </View>
        )}

        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountValue}>{item.amount}</Text>
        </View>
      </View>
    </View>
  );

  const currentData = paymentData[selectedTab] || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Header
        title="Payment history"
        showBack={true}
        onBackPress={handleBackPress}
      />

      <View style={styles.content}>
        {/* Tab Buttons */}
        <View style={styles.tabContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollContainer}
          >
            {tabs.map(renderTabButton)}
          </ScrollView>
        </View>

        {/* Payment History List */}
        <FlatList
          data={currentData}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.id}
          style={styles.paymentList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      <View style={styles.navbarSpacer} />
      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tabContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  tabScrollContainer: {
    paddingHorizontal: 0,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  activeTabButton: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  tabText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  activeTabText: {
    color: "white",
    fontWeight: "600",
  },
  paymentList: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  paymentItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  dateText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  paymentDetails: {
    gap: 8,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  successStatus: {
    color: "#10b981",
  },
  errorStatus: {
    color: "#ef4444",
  },
  companyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  companyLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  companyValue: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "500",
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  amountValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366f1",
  },
  navbarSpacer: {
    height: 80,
  },
});
