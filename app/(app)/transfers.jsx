import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Ionicons"; // Using Ionicons for person icon
import Header from "../components/header";
import Navbar from "../components/Navbar";

// Mock card and beneficiary data
const mockCards = [
  { id: 1, type: "VISA", number: "**** **** **** 1234", balance: 10000 },
  { id: 2, type: "MasterCard", number: "**** **** **** 5678", balance: 3500 },
];

const mockBeneficiaries = [
  { id: 1, name: "Emma", avatar: null },
  { id: 2, name: "Justin", avatar: null },
];

export default function Transfers() {
  const [selectedCard, setSelectedCard] = useState(mockCards[0]);
  const [selectedTransaction, setSelectedTransaction] = useState("card");
  const [beneficiaryName, setBeneficiaryName] = useState(
    "Capi Creative Design"
  );
  const [cardNumber, setCardNumber] = useState("0123456789109");
  const [amount, setAmount] = useState("1000");
  const [saveBeneficiary, setSaveBeneficiary] = useState(true);

  const handleCardChange = (cardId) => {
    const card = mockCards.find((c) => c.id === parseInt(cardId));
    setSelectedCard(card);
  };

  return (
    <View style={styles.container}>
      <Header title="Transfer" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Card dropdown */}
        <View style={styles.cardDropdown}>
          <Picker
            selectedValue={selectedCard.id.toString()}
            onValueChange={handleCardChange}
            style={styles.picker}
            mode="dropdown"
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
        <Text style={styles.balanceText}>
          Available balance : {selectedCard.balance.toLocaleString()}$
        </Text>

        {/* Transaction type */}
        <Text style={styles.sectionTitle}>Choose transaction</Text>
        <View style={styles.transactionTypeContainer}>
          {[
            { key: "card", label: "Transfer via card number" },
            { key: "same", label: "Transfer to the same bank" },
            { key: "other", label: "Transfer to another bank" },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.transactionButton,
                selectedTransaction === option.key && styles.activeTransaction,
              ]}
              onPress={() => setSelectedTransaction(option.key)}
            >
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

        {/* Beneficiary */}
        <Text style={styles.sectionTitle}>Choose beneficiary</Text>
        <View style={styles.beneficiaryRow}>
          {mockBeneficiaries.map((beneficiary) => (
            <View key={beneficiary.id} style={styles.beneficiaryBox}>
              <View style={styles.avatarIcon}>
                <Icon name="person" size={30} color="#888" />
              </View>
              <Text style={styles.beneficiaryName}>{beneficiary.name}</Text>
            </View>
          ))}
        </View>

        {/* Transfer Form */}
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
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Text style={styles.amountWords}>One thousand dollar</Text>

          <View style={styles.switchContainer}>
            <Switch
              value={saveBeneficiary}
              onValueChange={setSaveBeneficiary}
              thumbColor={saveBeneficiary ? "#4e2ddb" : "#ccc"}
            />
            <Text style={styles.switchLabel}>
              Save to directory of beneficiary
            </Text>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </ScrollView>

      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    paddingTop: 10,
  },
  cardDropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  balanceText: {
    color: "#4e2ddb",
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
    marginTop: 20,
    marginBottom: 10,
  },
  transactionTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionButton: {
    flex: 1,
    backgroundColor: "#eaeaea",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },
  activeTransaction: {
    backgroundColor: "#4e2ddb",
  },
  transactionTextActive: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 12,
  },
  transactionTextInactive: {
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 12,
  },
  beneficiaryRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  beneficiaryBox: {
    alignItems: "center",
    marginRight: 15,
  },
  avatarIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  beneficiaryName: {
    fontSize: 12,
    marginTop: 4,
    color: "#333",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  amountWords: {
    fontWeight: "600",
    color: "#4e2ddb",
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  switchLabel: {
    marginLeft: 10,
    color: "#333",
    fontSize: 14,
  },
  confirmButton: {
    marginTop: 30,
    backgroundColor: "#4e2ddb",
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
