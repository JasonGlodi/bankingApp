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
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "../components/header";
import Navbar from "../components/Navbar";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Transfers() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState("transfer");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [beneficiaryModalVisible, setBeneficiaryModalVisible] = useState(false);
  const [newBeneficiaryModalVisible, setNewBeneficiaryModalVisible] =
    useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [currencyDropdownVisible, setCurrencyDropdownVisible] = useState(false);
  const [newBeneficiaryEmail, setNewBeneficiaryEmail] = useState("");
  const [newBeneficiaryName, setNewBeneficiaryName] = useState("");
  const availableCurrencies = ["USD", "EUR", "GBP", "XAF"];

  const transactionIcons = {
    transfer: "swap-horizontal",
    deposit: "wallet",
    beneficiary: "people",
  };

  useEffect(() => {
    fetchUserData();
    fetchBeneficiaries();
  }, []);

  const fetchUserData = async () => {
    try {
      setRefreshing(true);
      const token = await AsyncStorage.getItem("authToken");
      const userEmail = await AsyncStorage.getItem("userEmail");

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
      Alert.alert("Error", "Failed to load user data. Please login again.");
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("userEmail");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchBeneficiaries = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      // In a real app, you would fetch saved beneficiaries from your backend
      // For now, we'll use the available users minus the current user
      const response = await axios.get("http://192.168.1.175:8000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const currentUserEmail = await AsyncStorage.getItem("userEmail");
      const filteredUsers = response.data.filter(
        (user) => user.email !== currentUserEmail
      );
      setBeneficiaries(filteredUsers);
    } catch (error) {
      console.error("Failed to fetch beneficiaries:", error);
    }
  };

  const addBeneficiary = async () => {
    if (!newBeneficiaryEmail || !newBeneficiaryName) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      // In a real app, you would save the beneficiary to your backend
      // For now, we'll simulate adding a beneficiary
      const newBeneficiary = {
        id: Math.random().toString(36).substring(7),
        username: newBeneficiaryName,
        email: newBeneficiaryEmail,
        currency: selectedCurrency,
      };

      setBeneficiaries([...beneficiaries, newBeneficiary]);
      setNewBeneficiaryEmail("");
      setNewBeneficiaryName("");
      setNewBeneficiaryModalVisible(false);
      Alert.alert("Success", "Beneficiary added successfully");
    } catch (error) {
      console.error("Failed to add beneficiary:", error);
      Alert.alert("Error", "Failed to add beneficiary");
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
      Alert.alert(
        "Error",
        error.response?.data?.detail || "Deposit failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleSelectBeneficiary = (email) => {
    setReceiverEmail(email);
    setBeneficiaryModalVisible(false);
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
              { key: "transfer", label: "Transfer" },
              { key: "deposit", label: "Deposit" },
              { key: "beneficiary", label: "Beneficiaries" },
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
                  size={24}
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

          {selectedTransaction === "beneficiary" ? (
            <View style={styles.beneficiarySection}>
              <TouchableOpacity
                style={styles.addBeneficiaryButton}
                onPress={() => setNewBeneficiaryModalVisible(true)}
              >
                <Icon name="person-add" size={20} color="#4e2ddb" />
                <Text style={styles.addBeneficiaryText}>Add Beneficiary</Text>
              </TouchableOpacity>

              <FlatList
                data={beneficiaries}
                keyExtractor={(item) => item.email}
                renderItem={({ item }) => (
                  <View style={styles.beneficiaryItem}>
                    <Icon name="person-circle" size={32} color="#4e2ddb" />
                    <View style={styles.beneficiaryInfo}>
                      <Text style={styles.beneficiaryName}>
                        {item.username}
                      </Text>
                      <Text style={styles.beneficiaryEmail}>{item.email}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.useBeneficiaryButton}
                      onPress={() => {
                        setReceiverEmail(item.email);
                        setSelectedTransaction("transfer");
                      }}
                    >
                      <Text style={styles.useBeneficiaryText}>Use</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Currency</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() =>
                  setCurrencyDropdownVisible(!currencyDropdownVisible)
                }
              >
                <Text style={styles.dropdownButtonText}>
                  {selectedCurrency}
                </Text>
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

              {selectedTransaction === "transfer" ? (
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
                      onPress={() => setBeneficiaryModalVisible(true)}
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
                style={[
                  styles.actionButton,
                  processing && styles.disabledButton,
                ]}
                onPress={
                  selectedTransaction === "transfer"
                    ? handleTransfer
                    : handleDeposit
                }
                disabled={processing}
              >
                {processing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.actionButtonText}>
                    {selectedTransaction === "transfer"
                      ? "Transfer"
                      : "Deposit"}
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Beneficiary Selection Modal */}
      <Modal visible={beneficiaryModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Beneficiary</Text>
            <FlatList
              data={beneficiaries}
              keyExtractor={(item) => item.email}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectBeneficiary(item.email)}
                >
                  <View style={styles.userInfo}>
                    <Icon name="person-circle" size={24} color="#4e2ddb" />
                    <View style={styles.userDetails}>
                      <Text style={styles.userName}>{item.username}</Text>
                      <Text style={styles.userEmail}>{item.email}</Text>
                      <Text style={styles.userCurrency}>
                        {item.currency || "USD"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setBeneficiaryModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add New Beneficiary Modal */}
      <Modal
        visible={newBeneficiaryModalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Beneficiary</Text>

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter beneficiary name"
              value={newBeneficiaryName}
              onChangeText={setNewBeneficiaryName}
            />

            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter beneficiary email"
              value={newBeneficiaryEmail}
              onChangeText={setNewBeneficiaryEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.modalButtonGroup}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setNewBeneficiaryModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={addBeneficiary}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
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
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTransaction: {
    backgroundColor: "#4e2ddb",
  },
  transactionTextActive: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  transactionTextInactive: {
    color: "#333",
    fontSize: 14,
  },
  beneficiarySection: {
    marginTop: 16,
  },
  addBeneficiaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#4e2ddb",
  },
  addBeneficiaryText: {
    color: "#4e2ddb",
    fontWeight: "bold",
    marginLeft: 8,
  },
  beneficiaryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  beneficiaryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  beneficiaryName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  beneficiaryEmail: {
    fontSize: 14,
    color: "#666",
  },
  useBeneficiaryButton: {
    backgroundColor: "#4e2ddb",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  useBeneficiaryText: {
    color: "#fff",
    fontSize: 14,
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
    flex: 1,
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
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
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
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalItem: {
    padding: 12,
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
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    marginTop: 12,
  },
  modalInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  modalButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  confirmButton: {
    backgroundColor: "#4e2ddb",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
