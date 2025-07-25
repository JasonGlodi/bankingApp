import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "../components/header";
import Navbar from "../components/Navbar";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Transfers() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState("card");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [currencyDropdownVisible, setCurrencyDropdownVisible] = useState(false);
  const availableCurrencies = ["USD", "EUR", "GBP", "XAF"];

  const transactionIcons = {
    card: "card",
    same: "business",
    other: "swap-horizontal",
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setRefreshing(true);
      const token = await AsyncStorage.getItem("authToken");
      const userEmail = await AsyncStorage.getItem("userEmail");

      console.log("Token from storage:", token); // Debug log
      console.log("User email from storage:", userEmail); // Debug log

      if (!token || !userEmail) {
        throw new Error("Authentication required");
      }

      // Get current user data
      const userResponse = await axios.get(
        "http://192.168.1.175:8000/balance",
        {
          params: { email: userEmail },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUser(userResponse.data);
      setBalance(userResponse.data.balance);

      // Get all users for beneficiary selection
      const usersResponse = await axios.get("http://192.168.1.175:8000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setAvailableUsers(usersResponse.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      console.error("Error details:", error.response?.data); // Debug log
      Alert.alert("Error", "Failed to load user data. Please login again.");
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("userEmail");
        // You might want to redirect to login screen here
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTransfer = async () => {
    if (!amount || !receiverEmail) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (parseFloat(amount) <= 0) {
      Alert.alert("Error", "Amount must be positive");
      return;
    }

    try {
      setProcessing(true);
      const token = await AsyncStorage.getItem("authToken");
      const userEmail = await AsyncStorage.getItem("userEmail");

      if (!token || !userEmail) {
        throw new Error("Authentication required");
      }

      const transferData = {
        sender_email: userEmail,
        receiver_email: receiverEmail,
        amount: parseFloat(amount),
        currency: selectedCurrency,
      };

      const response = await axios.post(
        "http://192.168.1.175:8000/transfer",
        transferData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Success", response.data.message);
      fetchUserData();
      setAmount("");
      setReceiverEmail("");
    } catch (error) {
      console.error("Transfer failed:", error);
      console.error("Error details:", error.response?.data); // Debug log
      Alert.alert(
        "Error",
        error.response?.data?.detail || "Transfer failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    try {
      setProcessing(true);
      const token = await AsyncStorage.getItem("authToken");
      const userEmail = await AsyncStorage.getItem("userEmail");

      if (!token || !userEmail) {
        throw new Error("Authentication required");
      }

      const depositData = {
        email: userEmail,
        amount: parseFloat(amount),
        currency: selectedCurrency,
      };

      const response = await axios.post(
        "http://192.168.1.175:8000/deposit",
        depositData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Success", response.data.message);
      fetchUserData();
      setAmount("");
    } catch (error) {
      console.error("Deposit failed:", error);
      console.error("Error details:", error.response?.data); // Debug log
      Alert.alert(
        "Error",
        error.response?.data?.detail || "Deposit failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Transfer" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4e2ddb" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Transfer" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchUserData}
              colors={["#4e2ddb"]}
            />
          }
        >
          {user && (
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Your Balance:</Text>
              <Text style={styles.balanceAmount}>
                {balance.toLocaleString()} {user.currency || "USD"}
              </Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Transaction Type</Text>
          <View style={styles.transactionTypeContainer}>
            {[
              { key: "card", label: "Transfer" },
              { key: "same", label: "Deposit" },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.transactionButton,
                  selectedTransaction === option.key &&
                    styles.activeTransaction,
                ]}
                onPress={() => setSelectedTransaction(option.key)}
              >
                <Icon
                  name={transactionIcons[option.key]}
                  size={32}
                  color={selectedTransaction === option.key ? "#fff" : "#333"}
                  style={{ marginBottom: 8 }}
                />
                <Text
                  style={
                    selectedTransaction === option.key
                      ? styles.transactionTextActive
                      : styles.transactionTextInactive
                  }
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Currency Dropdown */}
          <Text style={styles.sectionTitle}>Currency</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setCurrencyDropdownVisible(!currencyDropdownVisible)}
          >
            <Text style={styles.dropdownButtonText}>{selectedCurrency}</Text>
            <Icon
              name={currencyDropdownVisible ? "chevron-up" : "chevron-down"}
              size={20}
              color="#4e2ddb"
            />
          </TouchableOpacity>

          {currencyDropdownVisible && (
            <View style={styles.dropdownContainer}>
              {availableCurrencies.map((currency) => (
                <TouchableOpacity
                  key={currency}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedCurrency(currency);
                    setCurrencyDropdownVisible(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{currency}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {selectedTransaction === "card" ? (
            <>
              <Text style={styles.sectionTitle}>Recipient</Text>
              <View style={styles.beneficiaryHeader}>
                <TextInput
                  style={styles.input}
                  placeholder="Recipient Email"
                  value={receiverEmail}
                  onChangeText={setReceiverEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setUserModalVisible(true)}
                  style={styles.addButton}
                >
                  <Icon name="people" size={24} color="#4e2ddb" />
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Amount</Text>
              <View style={styles.amountInputContainer}>
                <TextInput
                  style={[styles.input, styles.amountInput]}
                  placeholder="Amount"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
                <Text style={styles.currencyText}>{selectedCurrency}</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Deposit Amount</Text>
              <View style={styles.amountInputContainer}>
                <TextInput
                  style={[styles.input, styles.amountInput]}
                  placeholder="Amount"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
                <Text style={styles.currencyText}>{selectedCurrency}</Text>
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.actionButton, processing && styles.disabledButton]}
            onPress={
              selectedTransaction === "card" ? handleTransfer : handleDeposit
            }
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.actionButtonText}>
                {selectedTransaction === "card" ? "Transfer" : "Deposit"}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Beneficiary Selection Modal */}
      <Modal visible={userModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Recipient</Text>
            <ScrollView>
              {availableUsers
                .filter((u) => u.email !== user?.email)
                .map((user) => (
                  <TouchableOpacity
                    key={user.email}
                    style={styles.modalItem}
                    onPress={() => {
                      setReceiverEmail(user.email);
                      setUserModalVisible(false);
                    }}
                  >
                    <View style={styles.userInfo}>
                      <Icon name="person-circle" size={24} color="#4e2ddb" />
                      <View style={styles.userDetails}>
                        <Text style={styles.userName}>{user.username}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                        <Text style={styles.userCurrency}>
                          {user.currency || "USD"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setUserModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#4e2ddb",
    fontSize: 16,
  },
  balanceContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 16,
    color: "#666",
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4e2ddb",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  transactionTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  transactionButton: {
    flex: 1,
    backgroundColor: "#e4e4e4",
    marginHorizontal: 5,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  activeTransaction: {
    backgroundColor: "#4e2ddb",
  },
  transactionTextActive: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  transactionTextInactive: {
    color: "#333",
    fontSize: 16,
  },
  beneficiaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountInput: {
    flex: 1,
    marginRight: 8,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4e2ddb",
  },
  addButton: {
    marginLeft: 8,
    padding: 10,
  },
  dropdownButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: -10,
    marginBottom: 16,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  actionButton: {
    backgroundColor: "#4e2ddb",
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#a39fc8",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    textAlign: "center",
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  userCurrency: {
    fontSize: 14,
    color: "#4e2ddb",
    fontWeight: "bold",
  },
  modalCloseButton: {
    padding: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  modalCloseText: {
    fontSize: 16,
    color: "#4e2ddb",
    fontWeight: "bold",
  },
});
