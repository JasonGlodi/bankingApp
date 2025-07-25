import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  Image, // Add this import
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/header";
import Navbar from "../../components/Navbar";

export default function MobilePrepaidScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const contacts = [
    { id: 1, name: "Emma", icon: "person-circle", color: "#FF6B6B" },
    { id: 2, name: "Justin", icon: "person-circle-outline", color: "#4ECDC4" },
  ];

  const amounts = [10, 20, 30];

  const handleBackPress = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/home");
    }
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setPhoneNumber("+237699288228"); // Mock phone number
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      if (!selectedContact && !phoneNumber) {
        Alert.alert("Error", "Please select a contact or enter a phone number");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedAmount) {
        Alert.alert("Error", "Please select an amount");
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setShowBiometricModal(true);
    }
  };

  const handleBiometricConfirm = () => {
    setShowBiometricModal(false);
    setShowSuccessModal(true);
  };

  const handleFinalConfirm = () => {
    setShowSuccessModal(false);
    router.push("/home");
  };

  const renderStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Recharge the phone #1";
      case 2:
        return "Recharge the phone #2";
      case 3:
        return "Recharge the phone #3 - Confirm";
      default:
        return "Mobile prepaid";
    }
  };

  const renderStep1 = () => (
    <ScrollView style={styles.stepContainer}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Choose contact here"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Directory</Text>
        <TouchableOpacity>
          <Text style={styles.sectionAction}>Find beneficiary</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contactsContainer}>
        {contacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={[
              styles.contactItem,
              selectedContact?.id === contact.id && styles.contactItemSelected,
            ]}
            onPress={() => handleContactSelect(contact)}
          >
            <View
              style={[
                styles.contactAvatarContainer,
                { backgroundColor: contact.color },
              ]}
            >
              <Ionicons name={contact.icon} size={32} color="white" />
            </View>
            <Text style={styles.contactName}>{contact.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.inputLabel}>Phone number</Text>
      <TextInput
        style={styles.phoneInput}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
      />

      <Text style={styles.inputLabel}>Choose amount</Text>
      <View style={styles.amountContainer}>
        {amounts.map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.amountButton,
              selectedAmount === amount && styles.amountButtonSelected,
            ]}
            onPress={() => handleAmountSelect(amount)}
          >
            <Text
              style={[
                styles.amountText,
                selectedAmount === amount && styles.amountTextSelected,
              ]}
            >
              XAF{amount}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.confirmLabel}>Please confirm here</Text>

      <View style={styles.confirmSection}>
        <Text style={styles.confirmSectionTitle}>VISA **** **** **** 1234</Text>
        <Text style={styles.confirmSectionSubtitle}>
          Available balance: 10,000XAF
        </Text>

        <Text style={styles.beneficiaryLabel}>Beneficiary</Text>
        <Text style={styles.beneficiaryTitle}>Find beneficiary</Text>

        <View style={styles.selectedContactContainer}>
          {selectedContact && (
            <View style={styles.selectedContactItem}>
              <View
                style={[
                  styles.selectedContactAvatarContainer,
                  { backgroundColor: selectedContact.color },
                ]}
              >
                <Ionicons name={selectedContact.icon} size={24} color="white" />
              </View>
              <Text style={styles.selectedContactName}>
                {selectedContact.name}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.phoneLabel}>Phone number</Text>
        <Text style={styles.phoneValue}>{phoneNumber}</Text>

        <View style={styles.amountSelectionContainer}>
          {amounts.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.amountSelectButton,
                selectedAmount === amount && styles.amountSelectButtonActive,
              ]}
              onPress={() => handleAmountSelect(amount)}
            >
              <Text
                style={[
                  styles.amountSelectText,
                  selectedAmount === amount && styles.amountSelectTextActive,
                ]}
              >
                XAF{amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.confirmTitle}>Confirm transaction information</Text>

      <View style={styles.transactionDetails}>
        <Text style={styles.detailLabel}>From</Text>
        <Text style={styles.detailValue}>**** **** 8739</Text>

        <Text style={styles.detailLabel}>To</Text>
        <Text style={styles.detailValue}>{phoneNumber}</Text>

        <Text style={styles.detailLabel}>Amount</Text>
        <Text style={styles.detailValueAmount}>XAF{selectedAmount}</Text>

        <Text style={styles.feeText}>
          Fee: XAF1.00 | Quick transaction{"\n"}
          <Text style={styles.feeSubtext}>We will process this quickly</Text>
        </Text>
      </View>

      <View style={styles.biometricContainer}>
        <View style={styles.biometricCircle}>
          <Ionicons name="scan" size={40} color="#4F46E5" />
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Header
        title={renderStepTitle()}
        showBack={true}
        onBackPress={handleBackPress}
      />

      <View style={styles.content}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>
          {currentStep === 3 ? "Confirm" : "Continue"}
        </Text>
      </TouchableOpacity>

      <View style={styles.navbarSpacer} />
      <Navbar />

      {/* Biometric Modal */}
      <Modal
        visible={showBiometricModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.biometricModal}>
            <Text style={styles.biometricTitle}>Face ID for CoBank</Text>
            <Text style={styles.biometricSubtitle}>
              Access to the application
            </Text>
            <View style={styles.biometricModalCircle}>
              <Ionicons name="scan" size={60} color="#4F46E5" />
            </View>
            <View style={styles.biometricModalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowBiometricModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBiometricButton}
                onPress={handleBiometricConfirm}
              >
                <Text style={styles.confirmBiometricButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIllustration}>// Add image</View>
            <Text style={styles.successTitle}>Payment success!</Text>
            <Text style={styles.successSubtitle}>
              You have successfully paid mobile prepaid!
            </Text>
            <TouchableOpacity
              style={styles.finalConfirmButton}
              onPress={handleFinalConfirm}
            >
              <Text style={styles.finalConfirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  stepContainer: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  sectionAction: {
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "500",
  },
  contactsContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  contactItem: {
    alignItems: "center",
    marginRight: 20,
    padding: 12,
    borderRadius: 12,
  },
  contactItemSelected: {
    backgroundColor: "#E8E5FF",
  },
  contactAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  contactName: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  phoneInput: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 20,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  amountButton: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  amountButtonSelected: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  amountTextSelected: {
    color: "white",
  },
  confirmLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  confirmSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
  },
  confirmSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  confirmSectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  beneficiaryLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  beneficiaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5",
    marginBottom: 16,
  },
  selectedContactContainer: {
    marginBottom: 20,
  },
  selectedContactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    padding: 12,
    alignSelf: "flex-start",
  },
  selectedContactAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedContactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  phoneLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  phoneValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginBottom: 20,
  },
  amountSelectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amountSelectButton: {
    flex: 1,
    height: 40,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  amountSelectButtonActive: {
    backgroundColor: "#4F46E5",
  },
  amountSelectText: {
    fontSize: 14,
    color: "#666",
  },
  amountSelectTextActive: {
    color: "white",
    fontWeight: "600",
  },
  confirmTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  transactionDetails: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 16,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  detailValueAmount: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  feeText: {
    fontSize: 14,
    color: "#666",
    marginTop: 16,
    lineHeight: 20,
  },
  feeSubtext: {
    color: "#999",
  },
  biometricContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  biometricCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8E5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  continueButton: {
    backgroundColor: "#4F46E5",
    marginHorizontal: 20,
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  navbarSpacer: {
    height: 80,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  biometricModal: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    margin: 20,
    minWidth: 280,
  },
  biometricTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  biometricSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
  biometricModalCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8E5FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  biometricModalActions: {
    flexDirection: "row",
    gap: 16,
  },
  cancelButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
  },
  confirmBiometricButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#4F46E5",
  },
  confirmBiometricButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  successModal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  successIllustration: {
    marginBottom: 20,
    alignItems: "center",
  },
  successImage: {
    width: 200,
    height: 150,
  },
  successIconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 150,
  },
  successDecorations: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  cardIcon: {
    position: "absolute",
    top: 20,
    left: 30,
    transform: [{ rotate: "-15deg" }],
  },
  shieldIcon: {
    position: "absolute",
    top: 30,
    right: 40,
  },
  coinIcon1: {
    position: "absolute",
    bottom: 40,
    left: 20,
  },
  coinIcon2: {
    position: "absolute",
    bottom: 50,
    right: 30,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  finalConfirmButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  finalConfirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
