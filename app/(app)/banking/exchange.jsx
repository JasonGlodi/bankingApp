import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Header from "../../components/header";
import Navbar from "../../components/Navbar";
import { Ionicons } from "@expo/vector-icons";

export default function ExchangeScreen() {
  const router = useRouter();
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [currencyItems, setCurrencyItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selecting, setSelecting] = useState("from");

  const API_KEY = "5e513b94141cb8ff254da33c";

  useEffect(() => {
    fetchSupportedCurrencies();
  }, []);

  const fetchSupportedCurrencies = async () => {
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/codes`
      );
      const data = await response.json();
      if (data.result === "success") {
        const items = data.supported_codes.map(([code, name]) => ({
          label: `${code} - ${name}`,
          value: code,
        }));
        setCurrencyItems(items);
      } else {
        Alert.alert("Error", "Failed to fetch currencies.");
      }
    } catch (error) {
      console.error("Currency fetch error:", error);
      Alert.alert("Error", "Could not load currencies.");
    }
  };

  const convertCurrency = async () => {
    if (!fromAmount) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}/${fromAmount}`
      );
      const data = await response.json();
      if (data.result === "success") {
        setToAmount(data.conversion_result.toFixed(2).toString());
      } else {
        Alert.alert("Conversion Error", data["error-type"] || "Unknown error.");
      }
    } catch (error) {
      console.error("Conversion error:", error);
      Alert.alert("Error", "Could not convert currency.");
    }
    setIsLoading(false);
  };

  const handleBackPress = () => {
    router.push("/banking");
  };

  const openCurrencySelector = (type) => {
    setSelecting(type);
    setModalVisible(true);
  };

  const selectCurrency = (code) => {
    if (selecting === "from") {
      setFromCurrency(code);
    } else {
      setToCurrency(code);
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Exchange" showBack={true} onBackPress={handleBackPress} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={100}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={require("../../../assets/Illustration.jpg")}
              style={styles.image}
              resizeMode="contain"
            />

            <View style={styles.card}>
              {/* FROM section */}
              <Text style={styles.label}>From</Text>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Amount"
                  style={styles.input}
                  keyboardType="numeric"
                  value={fromAmount}
                  onChangeText={setFromAmount}
                />
                <TouchableOpacity
                  style={styles.dropdownCard}
                  onPress={() => openCurrencySelector("from")}
                >
                  <Text style={styles.dropdownText}>{fromCurrency}</Text>
                  <Ionicons name="chevron-down" size={18} color="#333" />
                </TouchableOpacity>
              </View>

              {/* ARROW SECTION */}
              <View style={styles.arrowContainer}>
                <Ionicons
                  name="arrow-down"
                  size={30}
                  color="blue"
                  style={styles.arrowIcon}
                />
                <Ionicons
                  name="arrow-up"
                  size={30}
                  color="red"
                  style={styles.arrowIcon}
                />
              </View>

              {/* TO section */}
              <Text style={styles.label}>To</Text>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Converted Amount"
                  style={styles.input}
                  keyboardType="numeric"
                  value={toAmount}
                  editable={false}
                />
                <TouchableOpacity
                  style={styles.dropdownCard}
                  onPress={() => openCurrencySelector("to")}
                >
                  <Text style={styles.dropdownText}>{toCurrency}</Text>
                  <Ionicons name="chevron-down" size={18} color="#333" />
                </TouchableOpacity>
              </View>

              {/* Exchange Button */}
              <TouchableOpacity
                style={[
                  styles.exchangeButton,
                  fromAmount
                    ? { backgroundColor: "#007bff" }
                    : { backgroundColor: "#eee" },
                ]}
                onPress={convertCurrency}
                disabled={!fromAmount || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    style={[
                      styles.exchangeText,
                      fromAmount ? { color: "#fff" } : { color: "#ccc" },
                    ]}
                  >
                    Exchange
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* CURRENCY SELECT MODAL */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <FlatList
              data={currencyItems}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => selectCurrency(item.value)}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={{ color: "#007bff" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.navbarSpacer} />
      <Navbar />
    </SafeAreaView>
  );
}

// ========== STYLES ==========
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollContent: { padding: 16, alignItems: "center" },
  image: { width: "100%", height: 200, marginBottom: 20 },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  label: { color: "#999", marginBottom: 5, fontSize: 14 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  arrowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  arrowIcon: {
    marginHorizontal: 10,
  },

  dropdownCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    marginLeft: 10,
  },
  dropdownText: {
    marginRight: 6,
    fontSize: 14,
    color: "#333",
  },
  exchangeButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  exchangeText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  navbarSpacer: {
    height: 80,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  modalCloseButton: {
    marginTop: 10,
    alignItems: "center",
  },
});
