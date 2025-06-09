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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { toWords } from "number-to-words";
import Header from "../components/header";
import Navbar from "../components/Navbar";

// MOCK DATA (Replace with backend API call to fetch user's cards later)
const mockCards = [
  { id: 1, type: "VISA", number: "**** **** **** 1234", balance: 10000 },
  { id: 2, type: "MasterCard", number: "**** **** **** 5678", balance: 3500 },
];

// Mock users from database to choose from
const availableUsersMock = [
  { id: 3, name: "Grace" },
  { id: 4, name: "Mike" },
  { id: 5, name: "Daniel" },
];

const transactionIcons = {
  card: "card",
  same: "business",
  other: "swap-horizontal",
};

export default function Transfers() {
  const [selectedCard, setSelectedCard] = useState(mockCards[0]);
  const [selectedTransaction, setSelectedTransaction] = useState("card");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [amountWords, setAmountWords] = useState("");
  const [saveBeneficiary, setSaveBeneficiary] = useState(true);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);

  const [beneficiaries, setBeneficiaries] = useState([
    { id: 1, name: "Emma" },
    { id: 2, name: "Justin" },
  ]);

  const [availableUsers, setAvailableUsers] = useState(availableUsersMock);

  const availableCurrencies = ["USD", "FCFA", "EUR"];

  useEffect(() => {
    handleCurrencyConversion(amount, currency);
  }, [amount, currency]);

  const handleCardChange = (cardId) => {
    const card = mockCards.find((c) => c.id === parseInt(cardId));
    setSelectedCard(card);
  };

  const handleCurrencyConversion = async (value, curr) => {
    if (!value || isNaN(value)) {
      setAmountWords("");
      setConvertedAmount(null);
      return;
    }

    try {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/5e513b94141cb8ff254da33c/latest/USD`
      );
      const data = await res.json();
      const rate = data.conversion_rates[curr] || 1;
      const converted = (parseFloat(value) * rate).toFixed(2);

      setConvertedAmount(converted);
      setAmountWords(`${toWords(parseInt(converted))} ${curr}`);
    } catch (error) {
      console.log("Currency conversion error:", error);
      setConvertedAmount(value);
      setAmountWords(`${toWords(parseInt(value))} ${curr}`);
    }
  };

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
        >
          <View style={styles.cardDropdown}>
            <Text style={styles.sectionTitle}>Choose Card</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedCard.id.toString()}
                onValueChange={(itemValue) => handleCardChange(itemValue)}
                style={styles.picker}
              >
                {mockCards.map((card) => (
                  <Picker.Item
                    key={card.id}
                    label={`${card.type} ${card.number}`}
                    value={card.id.toString()}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <Text style={styles.balanceText}>
            Available balance : {selectedCard.balance.toLocaleString()}{" "}
            {currency}
          </Text>

          <Text style={styles.sectionTitle}>Choose Transaction</Text>
          <View style={styles.transactionTypeContainer}>
            {[
              { key: "card", label: "Via card number" },
              { key: "same", label: "Same bank" },
              { key: "other", label: "Other bank" },
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

          <View style={styles.beneficiaryHeader}>
            <Text style={styles.sectionTitle}>Choose Beneficiary</Text>
            <TouchableOpacity onPress={() => setUserModalVisible(true)}>
              <Icon name="add-circle-outline" size={30} color="#4e2ddb" />
            </TouchableOpacity>
          </View>
          <View style={styles.beneficiaryRow}>
            {beneficiaries.map((beneficiary) => (
              <View key={beneficiary.id} style={styles.beneficiaryBox}>
                <View style={styles.avatarIcon}>
                  <Icon name="person" size={36} color="#888" />
                </View>
                <Text style={styles.beneficiaryName}>{beneficiary.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Beneficiary Name"
              value={beneficiaryName}
              onChangeText={setBeneficiaryName}
            />
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <View style={styles.currencyInputWrapper}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={(val) => {
                  setAmount(val);
                  handleCurrencyConversion(val, currency);
                }}
              />
              <TouchableOpacity
                onPress={() => setCurrencyModalVisible(true)}
                style={styles.currencyCard}
              >
                <Text style={styles.currencyCardText}>{currency}</Text>
                <Icon name="chevron-down" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.amountWords}>{amountWords}</Text>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setSaveBeneficiary(!saveBeneficiary)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.checkbox,
                  saveBeneficiary && styles.checkboxChecked,
                ]}
              >
                {saveBeneficiary && (
                  <Icon name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                Save to directory of beneficiary
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal: Currency Selection */}
      <Modal visible={currencyModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            {availableCurrencies.map((curr) => (
              <TouchableOpacity
                key={curr}
                style={styles.modalCurrencyCard}
                onPress={() => {
                  setCurrency(curr);
                  handleCurrencyConversion(amount, curr);
                  setCurrencyModalVisible(false);
                }}
              >
                <Text style={styles.modalCurrencyText}>{curr}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setCurrencyModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal: Add Beneficiary from DB */}
      <Modal visible={userModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Beneficiary</Text>
            {availableUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={styles.modalCurrencyCard}
                onPress={() => {
                  if (!beneficiaries.find((b) => b.id === user.id)) {
                    setBeneficiaries([...beneficiaries, user]);
                  }
                  setUserModalVisible(false);
                }}
              >
                <Text style={styles.modalCurrencyText}>{user.name}</Text>
              </TouchableOpacity>
            ))}
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
  // same styles as before...
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    paddingTop: 10,
  },
  cardDropdown: {
    backgroundColor: "#fff",
    borderRadius: 6,
    marginVertical: 10,
    padding: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    paddingHorizontal: 10,
    color: "#333",
  },
  balanceText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginVertical: 8,
    fontSize: 16,
    color: "#333",
  },
  transactionTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
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
    textAlign: "center",
  },
  transactionTextInactive: {
    color: "#333",
    fontSize: 16,
    textAlign: "center",
  },
  beneficiaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  beneficiaryRow: {
    flexDirection: "row",
    marginVertical: 10,
    flexWrap: "wrap",
  },
  beneficiaryBox: {
    backgroundColor: "#fff",
    margin: 5,
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    width: 100,
  },
  avatarIcon: {
    backgroundColor: "#ddd",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  beneficiaryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  form: {
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 6,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  currencyInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencyCard: {
    backgroundColor: "#4e2ddb",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginLeft: 8,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  currencyCardText: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 4,
  },
  amountWords: {
    fontStyle: "italic",
    fontSize: 12,
    marginBottom: 12,
    color: "#666",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#4e2ddb",
    borderColor: "#4e2ddb",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#444",
  },
  confirmButton: {
    backgroundColor: "#4e2ddb",
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: 280,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalCurrencyCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  modalCurrencyText: {
    fontSize: 16,
    color: "#4e2ddb",
  },
  modalCloseButton: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 16,
    color: "#888",
  },
});
