import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Header from "../../components/header";
import Navbar from "../../components/Navbar";

export default function WithdrawScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCard, setSelectedCard] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleBackPress = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/home");
    }
  };

  const accounts = [
    "1900 8988 5456",
    "1900 8112 5222",
    "4411 0000 1234",
    "1900 8988 5456",
    "1900 8988 5456",
  ];

  const amountOptions = ["$10", "$50", "$100", "$150", "$200", "Other"];

  const handleCardSelect = () => {
    setShowAccountModal(true);
  };

  const handleAccountSelect = (account) => {
    setSelectedCard(`VISA •••• •••• •••• ${account.slice(-4)}`);
    setShowAccountModal(false);
  };

  const handleAmountSelect = (amount) => {
    if (amount === "Other") {
      setSelectedAmount("");
    } else {
      setSelectedAmount(amount);
      setCustomAmount("");
    }
  };

  const handleVerify = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setShowSuccessModal(true);
    }
  };

  const handleConfirmSuccess = () => {
    setShowSuccessModal(false);
    router.push("/home");
  };

  const isVerifyEnabled = () => {
    if (currentStep === 1) {
      return selectedCard && phoneNumber;
    } else if (currentStep === 2) {
      return selectedAmount || customAmount;
    } else if (currentStep === 3) {
      return customAmount || selectedAmount;
    }
    return false;
  };

  const renderIllustration = () => (
    <View style={styles.illustrationContainer}>
      <View style={styles.illustration}>
        {/* This would be replaced with your actual illustration */}
        <View style={styles.illustrationPlaceholder}>
          <Text style={styles.illustrationText}>💳💰📱</Text>
        </View>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.formContainer}>
      <TouchableOpacity style={styles.dropdown} onPress={handleCardSelect}>
        <Text
          style={[styles.dropdownText, !selectedCard && styles.placeholderText]}
        >
          {selectedCard || "Choose account/card"}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Phone number"
        placeholderTextColor="#999"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <Text style={styles.sectionTitle}>Choose amount</Text>

      <View style={styles.amountGrid}>
        {amountOptions.map((amount, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.amountButton,
              selectedAmount === amount && styles.selectedAmountButton,
            ]}
            onPress={() => handleAmountSelect(amount)}
          >
            <Text
              style={[
                styles.amountButtonText,
                selectedAmount === amount && styles.selectedAmountButtonText,
              ]}
            >
              {amount}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.formContainer}>
      <View style={styles.selectedCardContainer}>
        <Text style={styles.selectedCardText}>{selectedCard}</Text>
        <TouchableOpacity onPress={handleCardSelect}>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      <TextInput style={styles.input} value={phoneNumber} editable={false} />

      <Text style={styles.sectionTitle}>Choose amount</Text>

      <View style={styles.amountGrid}>
        {amountOptions.map((amount, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.amountButton,
              selectedAmount === amount && styles.selectedAmountButton,
            ]}
            onPress={() => handleAmountSelect(amount)}
          >
            <Text
              style={[
                styles.amountButtonText,
                selectedAmount === amount && styles.selectedAmountButtonText,
              ]}
            >
              {amount}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.formContainer}>
      <View style={styles.cardInfoContainer}>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>{selectedCard}</Text>
        </View>
        <Text style={styles.balanceText}>Available balance: 10,000$</Text>
      </View>

      <TextInput style={styles.input} value={phoneNumber} editable={false} />

      <Text style={styles.sectionTitle}>Choose amount</Text>

      <TextInput
        style={styles.amountInput}
        placeholder="Amount"
        placeholderTextColor="#999"
        value={customAmount}
        onChangeText={setCustomAmount}
        keyboardType="numeric"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Header title="Withdraw" showBack={true} onBackPress={handleBackPress} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderIllustration()}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.verifyButton,
            !isVerifyEnabled() && styles.disabledButton,
          ]}
          onPress={handleVerify}
          disabled={!isVerifyEnabled()}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>

      {/* Account Selection Modal */}
      <Modal
        visible={showAccountModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAccountModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose account:</Text>
              <TouchableOpacity onPress={() => setShowAccountModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {accounts.map((account, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.accountOption,
                  account === "4411 0000 1234" && styles.selectedAccount,
                ]}
                onPress={() => handleAccountSelect(account)}
              >
                <Text
                  style={[
                    styles.accountText,
                    account === "4411 0000 1234" && styles.selectedAccountText,
                  ]}
                >
                  {account}
                </Text>
                {account === "4411 0000 1234" && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            {renderIllustration()}

            <Text style={styles.successTitle}>Successful withdrawal!</Text>
            <Text style={styles.successMessage}>
              You have successfully withdrawn money!{"\n"}
              Please check the balance in the card{"\n"}
              management section.
            </Text>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmSuccess}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  illustration: {
    width: 300,
    height: 200,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  illustrationPlaceholder: {
    alignItems: "center",
  },
  illustrationText: {
    fontSize: 40,
  },
  formContainer: {
    paddingBottom: 20,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#666",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    marginTop: 8,
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  amountButton: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedAmountButton: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  amountButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  selectedAmountButtonText: {
    color: "#fff",
  },
  selectedCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedCardText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  cardInfoContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardRow: {
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  balanceText: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "500",
  },
  amountInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  verifyButton: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    fontSize: 18,
    color: "#666",
    padding: 5,
  },
  accountOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedAccount: {
    backgroundColor: "#f0f0ff",
  },
  accountText: {
    fontSize: 16,
    color: "#333",
  },
  selectedAccountText: {
    color: "#6366f1",
    fontWeight: "600",
  },
  checkmark: {
    color: "#6366f1",
    fontSize: 16,
    fontWeight: "bold",
  },
  successModalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    width: "85%",
    alignItems: "center",
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  confirmButton: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 60,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  navbarSpacer: {
    height: 80,
  },
});
