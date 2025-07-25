import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/header";
import Navbar from "../../components/Navbar";

export default function BeneficiaryScreen() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    chooseBank: "",
    chooseBranch: "",
    transactionName: "",
    cardNumber: "",
  });

  // Sample beneficiary data
  const [beneficiaries, setBeneficiaries] = useState([
    {
      id: 1,
      name: "Push",
      accountNumber: "12345678901",
      avatar: "../../assets/images/avatar1.jpg",
      category: "card",
    },
    {
      id: 2,
      name: "Olivia",
      accountNumber: "12345678901",
      avatar: "../../assets/images/avatar2.jpg",
      category: "card",
    },
    {
      id: 3,
      name: "Alexander",
      accountNumber: "12345678901",
      avatar: "../../assets/images/avatar3.jpg",
      category: "bank",
    },
    {
      id: 4,
      name: "Harper",
      accountNumber: "12345678901",
      avatar: "../../assets/images/avatar4.jpg",
      category: "bank",
    },
    {
      id: 5,
      name: "Thomas",
      accountNumber: "12345678901",
      avatar: "../../assets/images/avatar5.jpg",
      category: "other",
    },
    {
      id: 6,
      name: "Sammatha",
      accountNumber: "12345678901",
      avatar: "../../assets/images/avatar6.jpg",
      category: "other",
    },
    {
      id: 7,
      name: "Justin Biber",
      accountNumber: "12345678901",
      avatar: "../../assets/images/avatar7.jpg",
      category: "other",
    },
  ]);

  const handleBackPress = () => {
    router.push("/home");
  };

  const handleAddBeneficiary = () => {
    setShowAddModal(true);
  };

  const handleSaveToDirectory = () => {
    // Validate form
    if (
      !formData.name ||
      !formData.chooseBank ||
      !formData.chooseBranch ||
      !formData.transactionName ||
      !formData.cardNumber
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Create beneficiary object
    const newBeneficiary = {
      id: Date.now(),
      name: formData.name,
      accountNumber: formData.cardNumber,
      avatar: "../../assets/images/default-avatar.png",
      category: "card",
      bank: formData.chooseBank,
      branch: formData.chooseBranch,
      transactionName: formData.transactionName,
    };

    setSelectedBeneficiary(newBeneficiary);
    setShowAddModal(false);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    setBeneficiaries([...beneficiaries, selectedBeneficiary]);
    setShowConfirmModal(false);
    setSelectedBeneficiary(null);
    setFormData({
      name: "",
      chooseBank: "",
      chooseBranch: "",
      transactionName: "",
      cardNumber: "",
    });
    Alert.alert("Success", "Beneficiary added successfully!");
  };

  const renderBeneficiaryItem = (beneficiary) => (
    <TouchableOpacity key={beneficiary.id} style={styles.beneficiaryItem}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person" size={24} color="#666" />
      </View>
      <View style={styles.beneficiaryInfo}>
        <Text style={styles.beneficiaryName}>{beneficiary.name}</Text>
        <Text style={styles.accountNumber}>{beneficiary.accountNumber}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderBeneficiariesByCategory = (category, title) => {
    const categoryBeneficiaries = beneficiaries.filter(
      (b) => b.category === category
    );

    if (categoryBeneficiaries.length === 0) return null;

    return (
      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{title}</Text>
        {categoryBeneficiaries.map(renderBeneficiaryItem)}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Header
        title="Beneficiary"
        showBack={true}
        onBackPress={handleBackPress}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {renderBeneficiariesByCategory("card", "Transfer via card number")}
          {renderBeneficiariesByCategory("bank", "Transfer to the same bank")}
          {renderBeneficiariesByCategory("other", "Transfer to another bank")}
        </View>
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddBeneficiary}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Add Beneficiary Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add new</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                <Ionicons name="person" size={40} color="#666" />
              </View>
              <Text style={styles.profileName}>Push Puttichol</Text>
            </View>

            {/* Bank Selection */}
            <View style={styles.bankSelection}>
              <TouchableOpacity style={styles.bankOption}>
                <Ionicons name="card" size={24} color="#666" />
                <Text style={styles.bankOptionText}>Transfer to card</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bankOption, styles.bankOptionSelected]}
              >
                <Ionicons name="business" size={24} color="white" />
                <Text
                  style={[styles.bankOptionText, styles.bankOptionTextSelected]}
                >
                  Transfer to same bank
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Choose bank</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Citibank"
                  value={formData.chooseBank}
                  onChangeText={(text) =>
                    setFormData({ ...formData, chooseBank: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Choose branch</Text>
                <TextInput
                  style={styles.input}
                  placeholder="New York"
                  value={formData.chooseBranch}
                  onChangeText={(text) =>
                    setFormData({ ...formData, chooseBranch: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Transaction name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Push Puttichol"
                  value={formData.transactionName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, transactionName: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1235 5476 900"
                  value={formData.cardNumber}
                  onChangeText={(text) =>
                    setFormData({ ...formData, cardNumber: text })
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveToDirectory}
            >
              <Text style={styles.saveButtonText}>Save to directory</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.confirmHeader}>
            <TouchableOpacity onPress={() => setShowConfirmModal(false)}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.confirmTitle}>Beneficiary</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.confirmContent}>
            {selectedBeneficiary && (
              <View style={styles.confirmCard}>
                <View style={styles.confirmProfileSection}>
                  <View style={styles.confirmProfileImage}>
                    <Ionicons name="person" size={40} color="#666" />
                  </View>
                  <Text style={styles.confirmProfileName}>
                    {selectedBeneficiary.name}
                  </Text>
                </View>

                <View style={styles.confirmDetails}>
                  <View style={styles.confirmDetailRow}>
                    <Text style={styles.confirmDetailLabel}>Choose bank</Text>
                    <Text style={styles.confirmDetailValue}>
                      {selectedBeneficiary.bank}
                    </Text>
                  </View>
                  <View style={styles.confirmDetailRow}>
                    <Text style={styles.confirmDetailLabel}>Choose branch</Text>
                    <Text style={styles.confirmDetailValue}>
                      {selectedBeneficiary.branch}
                    </Text>
                  </View>
                  <View style={styles.confirmDetailRow}>
                    <Text style={styles.confirmDetailLabel}>
                      Transaction name
                    </Text>
                    <Text style={styles.confirmDetailValue}>
                      {selectedBeneficiary.transactionName}
                    </Text>
                  </View>
                  <View style={styles.confirmDetailRow}>
                    <Text style={styles.confirmDetailLabel}>Card number</Text>
                    <Text style={styles.confirmDetailValue}>
                      {selectedBeneficiary.accountNumber}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirm}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 14,
    color: "#999",
    marginBottom: 12,
    fontWeight: "500",
  },
  beneficiaryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#f0f0f0",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  beneficiaryInfo: {
    flex: 1,
  },
  beneficiaryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    position: "absolute",
    bottom: 100,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6B46C1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  navbarSpacer: {
    height: 80,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "white",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  bankSelection: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 12,
  },
  bankOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    gap: 8,
  },
  bankOptionSelected: {
    backgroundColor: "#FF9500",
  },
  bankOptionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  bankOptionTextSelected: {
    color: "white",
  },
  formSection: {
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  saveButton: {
    backgroundColor: "#6B46C1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    margin: 16,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  // Confirmation Modal Styles
  confirmHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#6B46C1",
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  confirmContent: {
    flex: 1,
    padding: 16,
  },
  confirmCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
  },
  confirmProfileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  confirmProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  confirmProfileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  confirmDetails: {
    gap: 16,
    marginBottom: 32,
  },
  confirmDetailRow: {
    gap: 4,
  },
  confirmDetailLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  confirmDetailValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
  },
  confirmButton: {
    backgroundColor: "#6B46C1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
