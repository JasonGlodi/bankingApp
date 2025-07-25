import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const InternetBill = () => {
  const navigation = useNavigation();
  const [billCode, setBillCode] = useState("");
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "Jackson Matine",
    address: "403 East 5th Street, Santa Ana",
    phone: "+8424389721",
    code: "#2143643",
    from: "01/10/2019",
    to: "01/11/2019",
    internetFee: 50,
    tax: 10,
    total: 60,
  });

  const handleCheckBill = () => {
    if (billCode.trim() === "") {
      Alert.alert(
        "Error",
        "Please enter the correct bill code to check information"
      );
      return;
    }
    setShowBillDetails(true);
  };

  const handlePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigation.navigate("PaymentSuccess", {
        billType: "Internet",
        amount: customerInfo.total,
      });
    }, 2000);
  };

  const handleGetOTP = () => {
    Alert.alert(
      "OTP Sent",
      "Verification code has been sent to your phone number"
    );
  };

  if (isProcessing) {
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
          <Text style={styles.headerTitle}>Internet bill</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Processing Screen */}
        <View style={styles.processingContainer}>
          <View style={styles.processingCard}>
            <View style={styles.successIcon}>
              <Ionicons name="shield-checkmark" size={48} color="#4CAF50" />
            </View>
            <Text style={styles.processingTitle}>
              Transaction successfully!
            </Text>
            <Text style={styles.processingSubtitle}>
              You can pay your internet bill
            </Text>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => handlePayment()}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (!showBillDetails) {
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
          <Text style={styles.headerTitle}>Pay the bill</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Input Form */}
        <View style={styles.content}>
          <View style={styles.inputCard}>
            <Text style={styles.inputTitle}>Internet bill #1</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Choose company</Text>
              <TouchableOpacity style={styles.dropdown}>
                <Text style={styles.dropdownText}>Select company</Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Type internet bill code</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Bill code"
                value={billCode}
                onChangeText={setBillCode}
                keyboardType="default"
              />
            </View>

            <Text style={styles.helpText}>
              Please enter the correct bill code to check information.
            </Text>
          </View>
        </View>

        {/* Check Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.checkButton}
            onPress={handleCheckBill}
          >
            <Text style={styles.checkButtonText}>Check</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Internet bill</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Bill Details */}
      <View style={styles.content}>
        <View style={styles.billCard}>
          <View style={styles.billHeader}>
            <View>
              <Text style={styles.billPeriod}>01/10/2019 - 01/11/2019</Text>
              <Text style={styles.billTitle}>All the bills</Text>
            </View>
            <View style={styles.illustrationContainer}>
              <Ionicons name="wifi" size={32} color="#9C27B0" />
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
              <Text style={styles.detailLabel}>Internet fee</Text>
              <Text style={styles.feeValue}>${customerInfo.internetFee}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tax</Text>
              <Text style={styles.feeValue}>${customerInfo.tax}</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.detailRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>${customerInfo.total}</Text>
            </View>
          </View>

          {/* OTP Section */}
          <View style={styles.otpSection}>
            <View style={styles.otpRow}>
              <TextInput
                style={styles.otpInput}
                placeholder="4411 0000 0334"
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.otpButton} onPress={handleGetOTP}>
                <Text style={styles.otpButtonText}>
                  Get OTP to verify transaction
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.otpInputRow}>
              <TextInput
                style={styles.otpCodeInput}
                placeholder="123456"
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Pay Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => setIsProcessing(true)}
        >
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
  inputCard: {
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
  inputTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: "#999",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
  },
  helpText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
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
  billPeriod: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  billTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  illustrationContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#9C27B020",
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
  otpSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    paddingTop: 20,
  },
  otpRow: {
    marginBottom: 12,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    marginBottom: 8,
  },
  otpButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  otpButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  otpInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  otpCodeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  processingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  processingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF5020",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  processingTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  processingSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    minWidth: 120,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    backgroundColor: "#FFFFFF",
  },
  checkButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
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

export default InternetBill;
